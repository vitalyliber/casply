Rails.application.routes.draw do
  post 'users/social_auth'
  resources :costumes do
    resources :comments
    resources :photos, only: [:destroy]
  end
  resources :cosplayers, only: [:show, :edit, :update] do
    member do
      post 'subscribe'
      post 'unsubscribe'
    end
  end
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: "costumes#index"
end
