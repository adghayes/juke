class UsersController < ApplicationController
  skip_before_action :require_logged_in, only: :create
  before_action :require_logged_out, only: :create

  def create
    @user = User.new(user_params)
    if @user.save
      @token = log_in_user(@user)
      render 'sessions/show'
    else
      puts @user.errors.details
      render json: @user.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    if params[:id]
      @user = User.find(id)
      render :show
    elsif current_user
      @user = current_user
      render :show
    else
      head :unauthorized
    end
  end

  def exists
    if ['email', 'display_name'].include? params[:field]
      render json: { 
        field: params[:field],
        value: params[:value],
        exists: User.exists?(params[:field] => params[:value])
      }
    else
      head :unprocessable_entity 
    end
  end

  private

  def user_params
    params.permit(:email, :password, :display_name)
  end
end
