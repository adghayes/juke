class UsersController < ApplicationController
  before_action :authorized, only: [:show]

  def create
    @user = User.new(user_params)
    if @user.save
      @token = get_token
      render :login
    else
      render json: {errors: @user.errors.messages}, status: :unprocessable_entity
    end
  end

  def login
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

    if @user
      @token = get_token
      render :login
    else
      render json: {error: "Invalid credentials"}, status: :unprocessable_entity
    end
  end

  def show
    @user = logged_in_user
    render :show
  end

  private

  def get_token
    payload = {
      sub: @user.id,
      exp: Time.now.to_i + 4 * 3600,
      iss: 'noisepuff'
    }

    encode_token(payload)
  end

  def user_params
    params.require(:user).permit(:email, :password, :display_name)
  end
end
