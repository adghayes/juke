class SessionsController < ApplicationController
  skip_before_action :require_logged_in, only: :create
  before_action :require_logged_out, only: :create

  def create
    @user = User.find_by_credentials(params[:email], params[:password])

    if @user
      @token = log_in_user(@user)
      render :show
    else
      render json: {error: "invalid credentials"}, status: :unprocessable_entity
    end
  end

  def destroy
    current_session.deactivate!
    session[:session_token] = nil
    head :ok
  end
end
