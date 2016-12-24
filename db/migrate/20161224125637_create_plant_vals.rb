class CreatePlantVals < ActiveRecord::Migration[5.0]
  def change
    create_table :plant_vals do |t|

      t.integer :plant_id

      t.string :state_type
      t.string :next_time

      t.integer :temperature
      t.integer :humidity
      t.float :ph

      t.timestamps
    end
  end
end
