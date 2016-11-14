class CreatePlants < ActiveRecord::Migration[5.0]
  def change
    create_table :plants do |t|
      t.integer :device_id
      t.string :type_plant
      t.string :state_device
      t.integer :state_work
      t.integer :state_sleep
      t.datetime :next_time
      t.integer :next_time_type
      t.integer :temperature
      t.integer :humidity

      t.timestamps
    end
  end
end
