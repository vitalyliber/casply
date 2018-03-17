class CommentsController < ApplicationController
  def create
    comment = current_user.comments.build(comment_params)
    comment.costume_id = params[:costume_id]
    comment.save
    redirect_back(fallback_location: root_path)
  end

  private

  def comment_params
    params.require(:comment).permit(:text)
  end
end
