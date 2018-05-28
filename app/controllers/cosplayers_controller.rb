class CosplayersController < ApplicationController
  before_action :find_user, only: [:show, :edit, :update, :subscribe, :unsubscribe]

  def show
    @costumes = @user.costumes.page(params[:page])
    @subscriber = Subscriber.find_by(subscription: current_user, follower: @user)
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

  def subscribe
    subscriber = Subscriber.new(subscription: current_user, follower: @user)
    if subscriber.save
      flash[:notice] = t('cosplayers.subscribed_successfully')
    else
      flash[:alert] = t('common.something_went_wrong')
    end
    redirect_to cosplayer_path(@user)
  end

  def unsubscribe
    subscriber = Subscriber.find_by(subscription: current_user, follower: @user)
    if subscriber.destroy
      flash[:notice] = t('cosplayers.unsubscribed_successfully')
    else
      flash[:alert] = t('common.something_went_wrong')
    end
    redirect_to cosplayer_path(@user)
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
