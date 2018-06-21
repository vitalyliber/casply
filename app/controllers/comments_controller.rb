class CommentsController < ApplicationController
  def create
    costume = Costume.find(params[:costume_id])
    comment = costume.comments.build(comment_params)
    comment.user = current_user
    comment.save
    redirect_back(fallback_location: root_path)
  end

  private

  def comment_params
    params.require(:comment).permit(:text)
  end
end
