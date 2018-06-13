class AddPgTrgmExtensionToDb < ActiveRecord::Migration[5.2]
  def up
    execute "create extension pg_trgm;"
    add_index :costumes, :name
  end

  def down
    execute "drop extension pg_trgm;"
    remove_index :costumes, :name
  end
end
