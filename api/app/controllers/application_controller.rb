class ApplicationController < ActionController::API
  before_action :authorized

  def encode_token(payload)
    JWT.encode payload, Rails.application.credentials.jwt[:key], 'HS256'
  end

  def auth_header
    # { Authorization: 'Bearer <token>' }
    request.headers['Authorization']
  end

  def decoded_token
    if auth_header
      token = auth_header.split(' ')[1]
      # header: { 'Authorization': 'Bearer <token>' }
      begin
        JWT.decode token, Rails.application.credentials.jwt[:key], true, { algorithm: 'HS256' }
      rescue JWT::DecodeError
        nil
      end
    end
  end

  def set_user
    if decoded_token
      user_id = decoded_token[0]['sub']
      @user = User.find_by(id: user_id)
    end
  end

  def logged_in_user
    @user || set_user
  end

  def logged_in?
    !!logged_in_user
  end

  def authorized
    render json: { message: 'Please log in' }, status: :unauthorized unless logged_in?
  end
end
