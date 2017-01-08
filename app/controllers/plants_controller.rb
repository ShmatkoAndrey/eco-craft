class PlantsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if params[:key]
      @device = Device.where(key_device: params[:key]).first
      @plant = @device.plants.last
      render json: { plant: @plant }
    else
      render json: { error: 'no key device!' }
    end
  end

  def update # Device.first.update(key_device: "6689305197")
    puts "updt #{  DateTime.now }".red
    if params[:key]
      @device = Device.where(key_device: params[:key]).first
      @plant = @device.plants.last

      next_time = DateTime.now.to_i + ( params[:next_time].to_i - params[:date_time].to_i )

      @plant_val =  @plant.plant_vals.create(
          temperature: params[:temperature],
          humidity: params[:humidity],
          ph: 5.2,
          state_type: params[:state_type],
          next_time: next_time,
      )
# $.ajax({ url: "http://192.168.1.103:3000/plants/1?key=6689305197&temperature=10&humidity=12&state_type=sleep&next_time=1483786448&date_time=1483785448", method: "PUT", async: false });
      app_broadcast "/eco-craft/#{ @plant.device.key_device }/update", { plant: @plant, plant_val: @plant_val }
      if params[:arduino] == 'true'
          render json: { info: [@plant.per_sleep, @plant.per_work, @plant.light_start, @plant.light_end ] }
      else
        render json: { plant: @plant, plant_val: @plant_val }
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