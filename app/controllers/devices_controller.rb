class DevicesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: { devices: current_user.devices }
  end

  def update

  end

  def create

  end

  def destroy

  end

  private

  def device_params

  end

end