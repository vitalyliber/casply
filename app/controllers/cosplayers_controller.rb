class CosplayersController < ApplicationController
  before_action :find_user, only: [:show, :edit, :update]

  def show
    @costumes = @user.costumes.page(params[:page])
  end

  def edit
    redirect_to cosplayer_path(current_user) unless can_edit?
  end

  def update
    return redirect_to cosplayer_path(current_user) unless can_edit?
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
    params.require(:user).permit(:name, :desc, :country, :gender, :photo, :website)
  end

  def can_edit?
    current_user == @user
  end
end
