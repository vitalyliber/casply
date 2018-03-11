class Costume < ApplicationRecord
  validates_presence_of :name, :user
  validates_length_of :desc, minimum: 15, maximum: 455, allow_blank: true
  validates_length_of :universe, minimum: 3, allow_blank: true
  belongs_to :user
  has_many :comments
  has_many_attached :images
end