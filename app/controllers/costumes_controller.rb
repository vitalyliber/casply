class CostumesController < ApplicationController
  before_action :find_costume, only: [:show, :edit, :update]

  def index
  end

  def new
    @costume = Costume.new
  end

  def create
    @costume = current_user.costumes.new(costume_params)
    if @costume.save
      redirect_to costumes_path
    else
      render "new"
    end
  end

  def edit
  end

  def show
  end

  def update
    if @costume.update(costume_params)
      redirect_to costumes_path
    else
      render "edit"
    end
  end

  private

  def find_costume
    @costume = Costume.find(params[:id])
  end

  def costume_params
    params.require(:costume).permit(:name, :universe, :desc, photos: [])
  end
end
