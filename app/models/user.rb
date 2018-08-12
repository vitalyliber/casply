class User < ApplicationRecord
  scope :with_eager_loaded_photo, -> { eager_load(photo_attachment: :blob) }
  validates_presence_of :name, :country, :gender
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  validates_length_of :website, minimum: 5, maximum: 100, allow_blank: true
  enum gender: { female: 0, male: 1, other: 2 }
  enum social_type: { mail: 0, vk: 1, fb: 2 }
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable

  has_many :costumes, dependent: :destroy
  has_many :events, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_one_attached :photo
  has_many :push_notification_subscriptions, dependent: :destroy

  # magic from here ->
  # https://stackoverflow.com/questions/6559164/rails-associations-has-many-through-but-same-model
  has_many :subscriptions_association,
           :class_name => "Subscriber",
           :foreign_key => "subscription_id"
  has_many :subscriptions,
           :through => :subscriptions_association,
           :source => :follower
  has_many :followers_association,
           :class_name => "Subscriber",
           :foreign_key => "follower_id"
  has_many :followers,
           :through => :followers_association,
           :source => :subscription

  before_save :clear_website

  def clear_website
    self.website = website.try do |field|
      field
        .sub('https://', '')
        .sub('http://', '')
    end
  end

  # trick for devise
  def remember_me
    true
  end
end
