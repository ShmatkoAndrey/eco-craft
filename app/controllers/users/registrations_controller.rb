class Users::RegistrationsController < Devise::RegistrationsController
  skip_before_filter :verify_authenticity_token, :only => [:destroy, :create]
  respond_to :json

  def create
    build_resource(sign_up_params)
    resource.save
    yield resource if block_given?
    if resource.persisted?
      if resource.active_for_authentication?
        sign_up(resource_name, resource)
        render json: {current_user: resource}
      else
        expire_data_after_sign_in!
        render json: {current_user: resource}
      end
    else
      clean_up_passwords resource
      set_minimum_password_length
      render json: {current_user: resource}
    end
  end

  protected

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end