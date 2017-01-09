class PlantTypesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    render json: { plant_types: PlantType.all }
  end

end
