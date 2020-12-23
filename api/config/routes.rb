Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resources 'users', only: [:create, :show] do
    collection do 
      get 'exists'
    end
  end
  resource 'user', only: [:show, :update]
  resource 'session', only: [:create, :destroy]
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'
end
