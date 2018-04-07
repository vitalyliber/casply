class User < ApplicationRecord
  scope :with_eager_loaded_photo, -> { eager_load(photo_attachment: :blob) }
  validates_presence_of :name, :country, :gender
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  validates_length_of :website, minimum: 5, maximum: 100, allow_blank: true
  enum gender: %i(female male other)
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  has_many :costumes
  has_many :comments
  has_one_attached :photo
end
