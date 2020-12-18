class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  before_action :identify_session
  before_action :require_logged_in

  attr_reader :current_session, :current_user

  def logged_in?
    @current_session
  end

  def log_in_user(user)
    client = DeviceDetector.new(request.user_agent)
    device = client.device_name || client.os_name
    browser = client.name

    new_session = Session.for(user, device: device, browser: browser)
    new_session.save ? new_session.token : nil
  end

  private

  def bearer_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ')[1]
  end

  def identify_session
    if bearer_token
      @current_session = Session.find_by(token: bearer_token, active: true)
      @current_user = (@current_session ? @current_session.user : nil)
    end
  end
  
  def require_logged_in
    render json: { error: 'login required'}, status: :unauthorized unless current_session
  end

  def require_logged_out
    render json: { message: 'already logged in' } if current_user
  end
end
