class Costume < ApplicationRecord
  is_impressionable counter_cache: true, unique: true
  paginates_per 25
  validates_presence_of :name, :universe, :user, :photos
  validates_length_of :name, :universe, minimum: 3, maximum: 100
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  validates_length_of :universe, minimum: 3, maximum: 100, allow_blank: true
  scope :with_eager_loaded_photos, -> { eager_load(photos_attachments: :blob) }
  belongs_to :user, counter_cache: true
  has_many :comments, as: :commentable, dependent: :destroy
  has_many_attached :photos
end
