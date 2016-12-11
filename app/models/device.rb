class Device < ApplicationRecord

  after_create :generate_key

  belongs_to :user

  has_many :plants

  def generate_key
    update_column(:key_device, Random.new_seed.to_s[0..9])
  end

end
