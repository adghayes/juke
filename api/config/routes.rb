Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.htmlno
  resources 'tracks', only: [:create, :show, :update] do
    member do 
      post :streams, to: 'tracks#streams'
      post :like, to: 'tracks#like'
      delete :like, to: 'tracks#unlike'
      post :listen, to: 'tracks#listen'
    end
  end

  resources 'users', only: [:create, :show] do
    collection do 
      get 'exists'
    end
  end
  
  resource 'user', only: [:show, :update] do
    get 'likes', to: 'users#likes'
  end

  resource 'session', only: [:create, :destroy]
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'

  get :spotlight, to: 'feed#spotlight'
  get :feed, to: 'feed#show'
end
