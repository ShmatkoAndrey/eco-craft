class DevicesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: { devices: current_user.devices }
  end

  def update
    if params[:device][:key]
      @device = Device.where(key_device: params[:device][:key]).first
      @plant =  @device.plants.last
      puts @plant.inspect

      @plant.update(plant_type_id: params[:device][:plant_type_id] || 1,per_sleep: params[:device][:per_sleep], per_work: params[:device][:per_work],
                            light_start: params[:device][:light_start], light_end: params[:device][:light_end])
    end
    render json: { device: @device }
  end

  def create
    @device = current_user.devices.create(name: params[:device][:name])
    @plant = @device.plants.create(plant_type_id: params[:device][:plant_type_id] || 1, per_sleep: params[:device][:per_sleep], per_work: params[:device][:per_work],
                                   light_start: params[:device][:light_start], light_end: params[:device][:light_end])

    @plant.save
    render json: { device: @device }
  end

  def destroy

  end

  private

  def device_params

  end

end