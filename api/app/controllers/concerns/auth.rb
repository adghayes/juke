module Auth
  extend ActiveSupport::Concern

  attr_reader :current_session, :current_user

  def logged_in?
    identify_session
    !!current_session
  end

  private

  def bearer_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ')[1]
  end

  def identify_session
    if !current_session && bearer_token
      @current_session = Session.find_by(token: bearer_token, active: true)
      @current_user = (current_session ? current_session.user : nil)
    end
  end
  
  def require_logged_in
    head :unauthorized unless logged_in?
  end

  def require_logged_out
    head :unprocessable_entity if logged_in?
  end
end