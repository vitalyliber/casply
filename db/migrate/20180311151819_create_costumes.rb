class CreateCostumes < ActiveRecord::Migration[5.2]
  def change
    create_table :costumes do |t|
      t.string :name, default: ""
      t.string :universe, default: ""
      t.text :desc, default: ""
      t.references :user, foreign_key: true
      t.integer :comments_count, default: 0
      t.integer :impressions_count, default: 0
      t.integer :photos_count, default: 0

      t.timestamps
    end
  end
end
