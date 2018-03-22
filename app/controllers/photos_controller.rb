class PhotosController < ApplicationController
  def destroy
    costume = Costume.with_eager_loaded_photos.find(params[:costume_id])
    if costume.photos.count == 1
      flash[:alert] = t('costumes.can_not_remove_last_photo')
      return redirect_back(fallback_location: root_path)
    end
    costume.photos.find(params[:id]).purge
    costume.update(photos_count: costume.photos.count)
    redirect_back(fallback_location: root_path)
  end
end
