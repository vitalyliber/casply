class Subscriber < ApplicationRecord
  belongs_to :subscription, class_name: 'User', counter_cache: :subscriptions_count
  belongs_to :follower, class_name: 'User', counter_cache: :followers_count
  validates_presence_of :subscription, :follower
  validates_uniqueness_of :follower_id, scope: :subscription_id
end
