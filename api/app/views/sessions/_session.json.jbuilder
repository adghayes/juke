json.extract! session, :id, :token, :user, :active, :device, :browser, :location, :created_at, :updated_at
json.url session_url(session, format: :json)
