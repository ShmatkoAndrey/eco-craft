class DevicesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: { devices: current_user.devices }
  end

  def update
    if params[:key]
      @device = Device.where(key_device: params[:key]).first
      @device.device_insts.create(per_sleep: params[:per_sleep], per_work: params[:per_work])
      puts @device.device_insts.last.inspect
    end
  end

  def create

  end

  def destroy

  end

  private

  def device_params

  end

end