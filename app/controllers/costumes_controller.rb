class CostumesController < ApplicationController
  before_action :find_costume, only: [:show, :edit, :update]
  after_action :photos_counter_cache, only: [:create, :edit, :update]
  impressionist actions: [:show], unique: [:user_id, :impressionable_type, :impressionable_id]
  LIMIT_PHOTOS = 10

  def index
    @is_showing_subscriptions = user_signed_in? && current_user.subscriptions_count > 0 && !params[:popular]
    @costumes =
      Costume
      .with_eager_loaded_photos
      .where('photos_count > ?', 0)
      .try { |costumes|
        @is_showing_subscriptions ?
            costumes.where(user_id: current_user.subscriptions.ids) :
            costumes }
      .order(created_at: :desc)
      .page(params[:page])
  end

  def new
    @costume = Costume.new
    @limit_photos = LIMIT_PHOTOS
  end

  def create
    @costume = current_user.costumes.new(limit_photos!(costume_params))
    if @costume.save
      redirect_to costume_path(@costume)
    else
      render 'new'
    end
  end

  def edit
    @limit_photos = LIMIT_PHOTOS
    unless user_costume?
      redirect_to costume_path(@costume)
    end
  end

  def show
    @comments =
      @costume
        .comments
        .order(created_at: :desc)
        .page(params[:page])

    js_variables = {
        canRemove: user_signed_in? && @costume.user_id == current_user.id,
        costumeId: @costume.id,
        photos: @costume.photos.map do |photo|
          {
              id: photo.id,
              src: photo.variant(resize: "1024")
                     .processed
                     .service_url
          }
        end
    }
    gon.push(js_variables)

    desc = 'Costume page'
    set_meta_tags description: desc,
        og: {
            title: @costume.name,
            type: 'website',
            description: desc,
            image: js_variables[:photos][0][:url]
        }
  end

  def update
    unless user_costume?
      return redirect_to costume_path(@costume)
    end
    if @costume.update(limit_photos!(costume_params, @costume.photos_count))
      redirect_to @costume
    else
      render 'edit'
    end
  end

  private

  def find_costume
    @costume = Costume.with_eager_loaded_photos.find(params[:id])
  end

  def costume_params
    params.require(:costume).permit(:name, :universe, :desc, photos: [])
  end

  def photos_counter_cache
    @costume.update(photos_count: @costume.photos.count)
  end

  def user_costume?
    @costume.user_id == current_user.id
  end

  def limit_photos!(params, photos_number = 0)
    limit = LIMIT_PHOTOS - photos_number
    if params[:photos] && params[:photos].count > limit
      flash[:notice] = t('costumes.limit_photos', number: LIMIT_PHOTOS)
      params[:photos] = if limit < 0
                          []
                        else
                          params[:photos][0, limit]
                        end
      return params
    end
    params
  end
end
