class ApplicationController < ActionController::API
  include Auth
  helper_method :current_user
  before_action :identify_bearer
  before_action :set_default_response_format

  def log_in_user(user)
    client = DeviceDetector.new(request.user_agent)
    device = client.device_name || client.os_name
    browser = client.name

    Session.for(user, device: device, browser: browser).token
  end

  def set_default_response_format
    request.format = :json
  end
end
