class AddNewFieldsToEvent < ActiveRecord::Migration[5.2]
  def up
    add_column :events, :formatted_address, :string
    add_column :events, :place_id, :string
    add_column :events, :lat, :float
    add_column :events, :lng, :float
    remove_column :events, :city
    rename_column :events, :country, :country_code
  end

  def down
    remove_column :events, :formatted_address
    remove_column :events, :place_id
    remove_column :events, :lat
    remove_column :events, :lng
    add_column :events, :city, :string
    rename_column :events, :country_code, :country
  end
end
