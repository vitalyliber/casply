class Costume < ApplicationRecord
  validates_presence_of :name, :universe, :user, :images
  validates_length_of :name, :universe, minimum: 3, maximum: 100
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  validates_length_of :universe, minimum: 3, maximum: 100, allow_blank: true
  scope :with_eager_loaded_images, -> { eager_load(images_attachments: :blob) }
  belongs_to :user
  has_many :comments
  has_many_attached :images
end
