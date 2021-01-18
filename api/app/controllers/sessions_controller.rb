# frozen_string_literal: true

class SessionsController < ApplicationController
  before_action :require_logged_in, only: :destroy
  before_action :require_logged_out, only: :create

  def create
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

    if @user
      @token = log_in_user(@user)
      render :show, status: :created
    else
      head :unauthorized
    end
  end

  def destroy
    current_session.deactivate!
    head :ok
  end
end
