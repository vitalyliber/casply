class User < ApplicationRecord
  validates_presence_of :name
  validates_length_of :desc, minimum: 15, maximum: 455, allow_blank: true
  validates_length_of :country, :city, minimum: 3, maximum: 30, allow_blank: true
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  has_many :costumes
  has_many :comments
  has_one_attached :photo
end
