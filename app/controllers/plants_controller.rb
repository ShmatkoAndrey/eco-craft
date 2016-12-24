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

  def update # Device.first.update(key_device: "6689305197")
    if params[:key]
      @device = Device.where(key_device: params[:key]).first
      @plant = @device.plants.last

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
          render json: { status: 'ok', instructions: [@device.per_sleep, @device.per_work] }
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

  def time_now
    render json: { time_now: DateTime.now.to_i }
  end

  private

  def device_params

  end

end