Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  resource 'user', only: [:create, :show] do
    collection do
      post 'login'
    end
  end

  resource 'session', only: [:create, :destroy]
end
