class CreatePlants < ActiveRecord::Migration[5.0]
  def change
    create_table :plants do |t|
      t.integer :device_id

      t.integer :plant_type_id

      t.integer :per_sleep
      t.integer :per_work
      t.integer :light_start
      t.integer :light_end
      t.boolean :hum_ai

      t.timestamps
    end
  end
end
