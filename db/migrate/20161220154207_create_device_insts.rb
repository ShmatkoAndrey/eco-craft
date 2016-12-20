class CreateDeviceInsts < ActiveRecord::Migration[5.0]
  def change
    create_table :device_insts do |t|
      t.integer :device_id
      t.integer :per_sleep
      t.integer :per_work

      t.timestamps
    end
  end
end
