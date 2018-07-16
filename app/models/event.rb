class Event < ApplicationRecord
  paginates_per 25
  has_one_attached :image
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
