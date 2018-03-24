Rails.application.routes.draw do
  resources :costumes do
    resources :comments
    resources :photos, only: [:destroy]
  end
  resources :cosplayers, only: [:show, :edit, :update]
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "costumes#index"
end
