class ApplicationController < ActionController::API
  include Auth

  before_action :require_logged_in
  helper_method :current_user

  def log_in_user(user)
    client = DeviceDetector.new(request.user_agent)
    device = client.device_name || client.os_name
    browser = client.name

    new_session = Session.for(user, device: device, browser: browser)
    new_session.save ? new_session.token : nil
  end
end
