class CreateComments < ActiveRecord::Migration[5.2]
  def change
    create_table :comments do |t|
      t.references :commentable, polymorphic: true, index: true
      t.references :user, foreign_key: true
      t.text :text

      t.timestamps
    end
  end
end
