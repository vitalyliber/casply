class CosplayersController < ApplicationController
  before_action :find_user, only: [:show, :edit]

  def show
  end

  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to cosplayer_path(current_user)
    else
      render 'edit'
    end
  end

  private

  def find_user
    @user = User.with_eager_loaded_photo.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :desc, :country, :city, :photo)
  end
end
