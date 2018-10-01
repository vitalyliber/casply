class CostumesController < ApplicationController
  before_action :find_costume, only: [:show, :edit, :update, :destroy]
  after_action :photos_counter_cache, only: [:create, :edit, :update]
  impressionist actions: [:show], unique: [:user_id, :impressionable_type, :impressionable_id]

  def index
    name = params.dig(:search, :name)
    @costumes =
      Costume
      .with_eager_loaded_photos
      .where('photos_count > ?', 0)
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
  end

  def create
    @costume = current_user.costumes.new(costume_params)
    if @costume.save
      render json: @costume
    else
      render json: { errors: @costume.errors.full_messages }, status: 400
    end
  end

  def edit
    unless user_costume?
      render json: { errors: ['Unauthorized access'] }, status: 401
    end
    gon.push({
      costume_id: @costume.id,
      name: @costume.name,
      desc: @costume.desc,
      photos: @costume.photos.map do |photo|
        {
          id: photo.id,
          preview: rails_representation_url(photo.variant(resize: '100', interlace: 'plane'))
        }
      end
    })
  end

  def show
    @comments =
      @costume
        .comments
        .includes(:user)
        .order(created_at: :desc)
        .page(params[:page])

    @js_variables = {
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
              src: rails_representation_url(
                photo
                  .variant(resize: '1024', interlace: 'plane')),
              lq_src: rails_representation_url(
                  photo
                      .variant(resize: '350', interlace: 'plane')),
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
      render json: { errors: ['Unauthorized access'] }, status: 401
    end
    if @costume.update(costume_params)
      render json: {}, status: 201
    else
      render json: { messages: @costume.errors.full_messages }, status: 401
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
    params.require(:costume).permit(
      :name,
      :desc,
      photos: [],
      photos_attachments_attributes: [:id, :_destroy],
    )
  end

  def photos_counter_cache
    @costume.update(photos_count: @costume.photos.count)
  end

  def user_costume?
    @costume.user_id == current_user.id
  end
end
