class PhotosController < ApplicationController
  def destroy
    costume = Costume.find(params[:costume_id])
    unless current_user.costumes.include? costume
      return render json: {}, status: 401
    end
    if costume.photos.count == 1
      return render json: { errors: [t('costumes.can_not_remove_last_photo')] }, status: 400
    end
    costume.photos.find(params[:id]).purge
    costume.update(photos_count: costume.photos.count)
  end
end
