class UsersController < ApplicationController
  before_action :require_logged_in, only: [:update, :history]
  before_action :require_logged_out, only: :create

  def create
    @user = User.new(user_params)
    if @user.save
      @token = log_in_user(@user)
      render 'sessions/show', status: :created
    else
      render json: @user.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    if params[:id]
      @user = User.friendly.find(params[:id])
      render :show
    else
      require_logged_in
      return unless current_user
  
      @user = current_user
      render :show
    end
  end

  def update
    @user = User.friendly.find(params[:id])
    if @user == current_user
      if @user.update(user_params)
        render :show
      else
        render json: @user.errors.messages, status: :unprocessable_entity
      end
    else
      head :forbidden
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

  def tracks
    @user = User.friendly.find(params[:id])
    has_many_queue :tracks, tracks_user_path(@user)
  end

  def likes
    @user = User.friendly.find(params[:id])
    has_many_through_queue :likes, likes_user_path(@user)
  end

  def history
    @user = User.friendly.find(params[:id])
    if @user != current_user
      head :forbidden
      return
    end
    
    has_many_through_queue :recents, history_user_path(@user)
  end

  private

  def has_many_queue(association, next_path)
    queue association, :id, next_path
  end

  def has_many_through_queue(association, next_path)
    queue association, :track_id, next_path
  end

  def queue(association, key, next_path)
    latest = params[:latest] ? DateTime.iso8601(params[:latest]) : DateTime.now
    limit = params[:limit] ? params[:limit].to_i : 5

    track_ids_with_timestamp = @user.send(association)
      .where('created_at < ?', latest )
      .order(created_at: :desc)
      .limit(limit)
      .pluck(key, :created_at)
    track_ids, timestamps = track_ids_with_timestamp.transpose
    @tracks = track_ids ? Track.with_details.find(track_ids) : []
    
    @oldest = timestamps.try(:min).try(:iso8601)
    @path = next_path
    @limit = limit

    render 'tracks/queue'
  end

  def user_params
    params.require(:user).permit(:email, :password, :display_name, :bio, :avatar)
  end
end
