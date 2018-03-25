class CostumesController < ApplicationController
  before_action :find_costume, only: [:show, :edit, :update]
  after_action :photos_counter_cache, only: [:create, :edit, :update]

  def index
    @costumes =
      Costume
      .with_eager_loaded_photos
      .where('photos_count > ?', 0)
      .order(created_at: :desc)
      .page(params[:page])
  end

  def new
    @costume = Costume.new
  end

  def create
    @costume = current_user.costumes.new(costume_params)
    if @costume.save
      redirect_to costumes_path
    else
      render 'new'
    end
  end

  def edit; end

  def show; end

  def update
    if @costume.update(costume_params)
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
end
