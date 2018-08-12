class AddSocialFieldsToUser < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :social_type, :integer, default: 0
    add_column :users, :social_id, :string
    add_column :users, :has_email, :bool, default: true
  end
end
