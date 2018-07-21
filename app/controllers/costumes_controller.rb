class CostumesController < ApplicationController
  before_action :find_costume, only: [:show, :edit, :update, :destroy]
  after_action :photos_counter_cache, only: [:create, :edit, :update]
  impressionist actions: [:show], unique: [:user_id, :impressionable_type, :impressionable_id]
  LIMIT_PHOTOS = 10

  def index
    name = params.dig(:search, :name)
    @is_showing_subscriptions = user_signed_in? &&
        current_user.subscriptions_count > 0 && !params[:popular] &&
        !name
    @costumes =
      Costume
      .with_eager_loaded_photos
      .where('photos_count > ?', 0)
      .try { |costumes|
        @is_showing_subscriptions ?
            costumes.where(user_id: current_user.subscriptions.ids) :
            costumes }
      .try { |costumes|
        name ?
            costumes.search_by_name(name) :
            costumes }
      .order(created_at: :desc)
      .page(params[:page])
    desc = 'Cosplay from popular cosplayers in the Casply community, your best resource to discover and connect with cosplayers worldwide.'
    set_meta_tags description: desc,
                  og: {
                      type: 'website',
                      description: desc,
                  }
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
      @limit_photos = LIMIT_PHOTOS
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
        .includes(:user)
        .order(created_at: :desc)
        .page(params[:page])

    @js_variables = {
        limit_photos: LIMIT_PHOTOS,
        canRemove: user_signed_in? && @costume.user_id == current_user.id,
        costumeId: @costume.id,
        photos: @costume.photos.order(created_at: :desc).map do |photo|
          metadata = if photo.metadata[:height]
                       photo.metadata
                     else
                       photo.analyze
                       photo.metadata
                     end
          {
              id: photo.id,
              src: photo.variant(resize: '1024', interlace: 'plane')
                     .processed
                     .image
                     .service_url,
              w: metadata['width'] || 1024,
              h: metadata['height'] || 1024,
              title: ''
          }
        end
    }
    gon.push(@js_variables)

    desc = @costume.desc.truncate(160)
    set_meta_tags description: desc,
        og: {
            title: "Cosplay - #{@costume.name}",
            type: 'website',
            description: desc,
            image: @js_variables.dig(:photos, 0, :url)
        }
  end

  def update
    unless user_costume?
      if need_json_response?
        render json: {}, status: 401
      else
        return redirect_to costume_path(@costume)
      end
    end
    if @costume.update(limit_photos!(costume_params, @costume.photos_count))
      if need_json_response?
        render json: {}, status: 201
      else
        redirect_to @costume
      end
    else
      if need_json_response?
        render json: { messages: @costume.errors.full_messages }, status: 401
      else
        render 'edit'
      end
    end
  end

  def destroy
    return redirect_to root_path unless user_costume?
    @costume.destroy
    respond_to do |format|
      format.html { redirect_to cosplayer_path(current_user), notice: t('costumes.was_destroyed') }
      format.json { head :no_content }
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

  def need_json_response?
    # need for the js fetch
    # otherwise the fetch func will upload file multiple times
    params[:need_json_response]
  end
end
