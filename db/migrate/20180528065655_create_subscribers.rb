class CreateSubscribers < ActiveRecord::Migration[5.2]
  def change
    create_table :subscribers do |t|
      t.belongs_to :subscription, index: true
      t.belongs_to :follower, index: true

      t.timestamps
    end
  end
end
