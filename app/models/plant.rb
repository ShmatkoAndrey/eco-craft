class Plant < ApplicationRecord

  has_many :plant_vals

  belongs_to :device
  belongs_to :plant_type


end
