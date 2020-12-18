class UsersController < ApplicationController
  skip_before_action :require_logged_in, only: :create
  before_action :require_logged_out, only: :create

  def create
    @user = User.new(user_params)
    if @user.save
      @token = log_in_user(@user)
      render 'sessions/show'
    else
      render json: {errors: @user.errors.messages}, status: :unprocessable_entity
    end
  end

  def show
    @user = current_user
    render :show
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :display_name)
  end
end
