# frozen_string_literal: true

class TracksController < ApplicationController
  include AudioHelper

  before_action :require_logged_in, only: %i[create update like unlike exists]
  before_action :require_valid_jwt, only: :streams
  before_action :set_track, only: %i[show update streams listen]

  def create
    @track = Track.new(owner: current_user, **track_params)
    if @track.save
      render :show, status: :created
    else
      render json: @track.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    render :show
  end

  def update
    if @track.owner == current_user
      if @track.update(track_params)
        process_audio @track if @track.uploaded && @track.processing == 'none'
        render :show
      else
        render json: @track.errors.messages, status: :unprocessable_entity
      end
    else
      head :forbidden
    end
  end

  def like
    @like = Like.find_or_create_by({ user: current_user, track_id: params[:id] })
    if @like.persisted?
      render :like
    else
      render json: @like.errors.messages, status: :unprocessable_entity
    end
  end

  def unlike
    @like = Like.find_by(user: current_user, track_id: params[:id])
    if !@like
      head :ok
    elsif @like.destroy
      render :like
    else
      head :internal_server_error
    end
  end

  def listen
    @track.listen
    result = current_user.listen(@track) if current_user
    puts result
    head :ok
  end

  def streams
    if params[:status] != 200
      @track.update(processing: 'error')
      return head :ok
    end

    signed_blob_ids = []
    params[:outputs].each do |output|
      signed_blob_ids.push output[:id] if output[:id]
    end
    @track.streams.attach signed_blob_ids

    @track.peaks = encode_peaks(params[:peaks])
    @track.duration = params[:input][:metadata][:format][:duration]
    @track.processing = 'done'

    if @track.save
      head :ok
    else
      head :unprocessable_entity
    end
  end

  def exists
    if params[:title]
      query = { title: URI.decode(params[:title]), owner_id: current_user.id }
      render json: {
        user: query,
        exists: Track.exists?(query)
      }
    else
      head :bad_request
    end
  end

  private

  def set_track
    if params[:id]
      @track = Track.find(params[:id])
    else
      @artist = User.friendly.find(params[:artist])
      @track = @artist.tracks.friendly.find(params[:track])
    end
  end

  def track_params
    params.require(:track).permit(:title, :description, :downloadable,
                                  :owner_id, :thumbnail, :original, :uploaded, :submitted, :processing)
  end
end
