class Comment < ApplicationRecord
  validates_presence_of :text, :user
  validates_length_of :text, minimum: 3, maximum: 455
  belongs_to :commentable, polymorphic: true, counter_cache: true
  belongs_to :user
end
