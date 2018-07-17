class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :title
      t.date :date
      t.string :link
      t.string :country
      t.string :city
      t.text :desc
      t.belongs_to :user
      t.integer :costumes_count, default: 0

      t.timestamps
    end
  end
end
