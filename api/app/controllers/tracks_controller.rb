class TracksController < ApplicationController
  wrap_parameters false
  skip_before_action :require_logged_in, only: [:show]
  
  def create
    @track = Track.new(owner: current_user, **track_params)

    if @track.save
      render :show
    else
      render json: @track.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    @track = Track.find(params[:id])
    render :show
  end

  def update
    @track = Track.find(params[:id])
    if @track.owner == current_user
      if @track.update(track_params)
        render :show
      else
        render json: @track.errors.messages, status: :unprocessable_entity
      end
    else
      head :forbidden
    end
  end

  private

  def process_for_playback
    
  end

  def track_params
    params.permit(:title, :description, :downloadable, :owner_id, :thumbnail, :original)
  end

end
