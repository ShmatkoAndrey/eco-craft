class CreatePlants < ActiveRecord::Migration[5.0]
  def change
    create_table :plants do |t|
      t.integer :device_id
      t.integer :type_plant_id
      t.string :state_device
      t.string :state_type
      t.string :next_time
      t.string :next_time_type
      t.integer :period
      
      t.integer :temperature
      t.integer :humidity

      t.timestamps
    end
  end
end
