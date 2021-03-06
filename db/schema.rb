# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161224130312) do

  create_table "devices", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "name"
    t.string   "key_device"
    t.string   "state_device"
    t.boolean  "light"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  create_table "plant_types", force: :cascade do |t|
    t.string   "name"
    t.integer  "per_work"
    t.integer  "per_sleep"
    t.integer  "light_start"
    t.integer  "light_end"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "plant_vals", force: :cascade do |t|
    t.integer  "plant_id"
    t.string   "state_type"
    t.string   "next_time"
    t.integer  "temperature"
    t.integer  "humidity"
    t.float    "ph"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  create_table "plants", force: :cascade do |t|
    t.integer  "device_id"
    t.integer  "plant_type_id"
    t.integer  "per_sleep"
    t.integer  "per_work"
    t.integer  "light_start"
    t.integer  "light_end"
    t.boolean  "hum_ai"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
