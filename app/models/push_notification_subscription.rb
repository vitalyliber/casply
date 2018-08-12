class PushNotificationSubscription < ApplicationRecord
  enum notification_type: { web: 0, mobile: 1 }
  validates :endpoint, presence: true, uniqueness: true
  validates :user, presence: true
  validates :p256dh_key, presence: true, uniqueness: true
  validates :auth_key, presence: true, uniqueness: true
  belongs_to :user

  def send_push(message, url = ENV['HOST'])
    data = {
        body: message,
        url: url,
    }

    begin
      Webpush.payload_send(
        endpoint: endpoint,
        message: JSON.generate(data),
        p256dh: p256dh_key,
        auth: auth_key,
        ttl: 24 * 60 * 60,
        vapid: {
          subject: "https://www.casply.com",
          public_key: ENV['VAPID_PUBLIC_KEY'],
          private_key: ENV['VAPID_PRIVATE_KEY'],
        },
      )
    rescue Webpush::Error => e
      logger.info "PUSHER ERROR: #{e.message}"
      # remove an invalid subscription
      self.delete
    end
  end
end
