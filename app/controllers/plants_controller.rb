class PlantsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @plant = Device.where(key_device: params[:key]).first.plants.first
    render json: { plant: @plant }
  end

  def update
    @plant = Device.where(key_device: params[:key]).first.plants.first

    @plant.update(
        temperature: params[:plant][:temperature],
        humidity: params[:plant][:humidity],
    )
    app_broadcast "/eco-craft/#{ @plant.device.key_device }/update", { plant: @plant }
    render json: { plant: @plant }
  end

  def create

  end

  def destroy
    # Убирать id устройства
  end

  private

  def device_params

  end

end