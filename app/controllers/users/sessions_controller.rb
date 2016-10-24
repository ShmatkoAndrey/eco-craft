class Users::SessionsController < Devise::SessionsController
  skip_before_filter :verify_authenticity_token, :only => [:destroy, :create]
  respond_to :json

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?
    render json: { current_user: resource }
  end

  def destroy
    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    yield if block_given?
    render json: {signed_out: signed_out}
  end

  def get_current_user
    render json: { current_user: current_user }
  end

  protected

  def sign_in_params
    params.require(:user).permit(:email, :password, :remember_me)
  end
end