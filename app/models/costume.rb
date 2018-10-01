class Costume < ApplicationRecord
  is_impressionable counter_cache: true
  paginates_per 25
  include PgSearch
  pg_search_scope :search_by_name,
                  against: :name,
                  using: {
                      tsearch: { any_word: true },
                      trigram: { threshold: 0.3 }
                  }
  validates_presence_of :name, :user
  validates_length_of :name, minimum: 3, maximum: 100
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  scope :with_eager_loaded_photos, -> { eager_load(photos_attachments: :blob) }
  belongs_to :user, counter_cache: true
  has_many :comments, as: :commentable, dependent: :destroy
  has_many_attached :photos
  accepts_nested_attributes_for :photos_attachments, allow_destroy: true
  before_update :purge_blobs

  def send_comment_notification(text)
    user.push_notification_subscriptions.each do |sub|
      sub.send_push(text, "#{ENV['HOST']}/costumes/#{id}")
    end
  end

  private

  # destroying photos via nested attributes
  def purge_blobs
    photos_attachments.each do |photo_attachment|
      if photo_attachment.marked_for_destruction?
        photo_attachment.blob.purge_later
      end
    end
  end

end
