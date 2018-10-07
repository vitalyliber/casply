class RemoveUniverseFromCostume < ActiveRecord::Migration[5.2]
  def change
    remove_column :costumes, :universe
  end
end
