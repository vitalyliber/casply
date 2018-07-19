class PhotosController < ApplicationController
  def destroy
    costume = Costume.find(params[:costume_id])
    unless current_user.costumes.include? costume
      return render json: {}, status: 401
    end
    costume.photos.find(params[:id]).purge
    costume.update(photos_count: costume.photos.count)
  end
end
