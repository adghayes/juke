# frozen_string_literal: true

module Auth
  extend ActiveSupport::Concern

  attr_reader :current_session, :current_user

  def require_auth
    identify_bearer
    head :unauthorized unless @valid_jwt || current_user
  end

  def require_valid_jwt
    identify_bearer
    head :unauthorized unless @valid_jwt
  end

  def require_logged_in
    identify_bearer
    head :unauthorized unless current_user
  end

  def require_logged_out
    identify_bearer
    head :unprocessable_entity if current_user
  end

  def encode_jwt(payload)
    JWT.encode payload, Rails.application.credentials.jwt[:key], 'HS256'
  end

  private

  def identify_bearer
    return false if @bearer_identified

    @bearer_token = get_bearer_token
    @bearer_token_type = @bearer_token ? token_type(@bearer_token) : nil

    case @bearer_token_type
    when :session
      identify_session(@bearer_token)
    when :jwt
      verify_jwt(@bearer_token)
    end

    @bearer_identified = true
  end

  def get_bearer_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header

    auth_header.split(' ')[1]
  end

  def token_type(token)
    token.include?('.') ? :jwt : :session
  end

  def identify_session(token)
    @current_session = Session.find_by(token: token, active: true)
    @current_user = current_session.try(:user)
  end

  def verify_jwt(jwt)
    payload = decode_jwt(jwt)
    @valid_jwt = payload['exp'] > Time.now.to_i
  end

  def decode_jwt(token)
    decoded = JWT.decode token, Rails.application.credentials.jwt[:key], true, { algorithm: 'HS256' }
    decoded[0]
  rescue JWT::DecodeError
    nil
  end
end
