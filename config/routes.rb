Rails.application.routes.draw do
  devise_for :users, controllers: {
      sessions: 'users/sessions',
      registrations: 'users/registrations'
  }
  devise_scope :user do
    get 'users/current_user' => 'users/sessions#get_current_user'
  end

  root 'application#start_page'

  resources :devices, only: [:index, :create, :update, :destroy]
  resources :plants, only: [:index, :create, :update, :destroy]

  get 'time_now' => 'plants#time_now'

  resources :plant_types

end
