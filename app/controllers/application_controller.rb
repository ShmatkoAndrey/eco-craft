class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def start_page
    render 'layouts/application'
  end

  def app_broadcast(channel, hash) # rackup faye.ru -s thin -E production
    message = {:channel => channel, :data => hash, :ext => {:auth_token => 'seed'}}
    uri = Rails.env.development? ? URI.parse("http://#{ request.host }:9292/faye") : URI.parse('http://socketmiamitalks.herokuapp.com/faye')
    Net::HTTP.post_form(uri, :message => message.to_json)
  end

  helper_method 'app_broadcast'

end
