class CreatePushNotificationSubscriptions < ActiveRecord::Migration[5.2]
  def change
    create_table :push_notification_subscriptions do |t|
      t.string "auth_key"
      t.string "endpoint"
      t.integer "notification_type", default: 0
      t.string "p256dh_key"
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
