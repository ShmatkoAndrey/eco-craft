class CreatePlantTypes < ActiveRecord::Migration[5.0]
  def change
    create_table :plant_types do |t|

      t.string :name
      t.integer :per_work
      t.integer :per_sleep
      t.integer :light_start
      t.integer :light_end

      t.timestamps
    end
  end
end
