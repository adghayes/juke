class UsersController < ApplicationController
  before_action :require_logged_in, only: :update
  before_action :require_logged_out, only: :create

  def create
    @user = User.new(user_params)
    if @user.save
      @token = log_in_user(@user)
      render 'sessions/show'
    else
      render json: @user.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    if params[:id]
      @user = User.find(params[:id])
      render :show
    else
      require_logged_in
      return unless current_user
  
      @user = current_user
      render :show
    end
  end

  def update
    if current_user.update(user_params)
      @user = current_user
      render :show
    else
      render json: current_user.errors.messages, status: :unprocessable_entity
    end
  end
    
  def exists
    query = params.require(:user).permit(:email, :display_name)
    if query.length > 0
      render json: { 
        user: query,
        exists: User.exists?(query)
      }
    else
      head :unprocessable_entity 
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :display_name, :bio, :avatar)
  end
end
