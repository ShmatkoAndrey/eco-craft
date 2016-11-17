class PlantsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if params[:key]
      @plant = Device.where(key_device: params[:key]).first.plants.first
      if params[:arduino] == 'true'
        render json: { status: 'ok' }
      else
        render json: { plant: @plant }
      end
    else
      render json: { error: 'no key device!' }
    end

  end

  def update
    if params[:key]
      @plant = Device.where(key_device: params[:key]).first.plants.first
      @plant.update(
          temperature: params[:temperature],
          humidity: params[:humidity],
      )
      app_broadcast "/eco-craft/#{ @plant.device.key_device }/update", { plant: @plant }
      render json: { plant: @plant }
    else
      render json: { error: 'no key device!' }
    end
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