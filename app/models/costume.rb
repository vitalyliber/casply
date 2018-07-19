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
  validates_presence_of :name, :universe, :user
  validates_length_of :name, :universe, minimum: 3, maximum: 100
  validates_length_of :desc, minimum: 3, maximum: 455, allow_blank: true
  validates_length_of :universe, minimum: 3, maximum: 100, allow_blank: true
  scope :with_eager_loaded_photos, -> { eager_load(photos_attachments: :blob) }
  belongs_to :user, counter_cache: true
  has_many :comments, as: :commentable, dependent: :destroy
  has_many_attached :photos, dependent: :destroy
end
