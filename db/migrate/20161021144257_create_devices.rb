class CreateDevices < ActiveRecord::Migration[5.0]
  def change
    create_table :devices do |t|
      t.string :name
      t.integer :user_id
      t.integer :type_name

      t.timestamps
    end
  end
end
