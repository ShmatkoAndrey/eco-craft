class PlantsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if params[:key]
      @plant = Device.where(key_device: params[:key]).first.plants.first
      render json: { plant: @plant }
    else
      render json: { error: 'no key device!' }
    end

  end

  def update
  if params[:key]
      @plant = Device.where(key_device: params[:key]).first.plants.first

      next_time = DateTime.now.to_i + ( params[:next_time].to_i - params[:date_time].to_i )

      @plant.update(
          temperature: params[:temperature],
          humidity: params[:humidity],
          state_type: params[:state_type],
          next_time: next_time,
          next_time_type: params[:next_time_type],
          period: params[:period]
      )
      app_broadcast "/eco-craft/#{ @plant.device.key_device }/update", { plant: @plant }
      if params[:arduino] == 'true'
        render json: { status: 'ok' }
      else
        render json: { plant: @plant }
      end
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