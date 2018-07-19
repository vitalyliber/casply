class Event < ApplicationRecord
  paginates_per 25
  scope :with_eager_loaded_image, -> { eager_load(image_attachment: :blob) }
  has_one_attached :image, dependent: :destroy
  belongs_to :user
  validates_date :date, :on_or_after => lambda { Date.current }
  validates_presence_of :title, :desc, :date, :user, :country, :city, :link

  before_save :clear_link

  def clear_link
    self.link = link.try do |field|
      field
          .sub('https://', '')
          .sub('http://', '')
    end
  end
end
