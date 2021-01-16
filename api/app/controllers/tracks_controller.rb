# frozen_string_literal: true

class TracksController < ApplicationController
  before_action :require_logged_in, only: %i[create update like unlike]
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
        start_processing if @track.uploaded == true && @track.processing == 'none'
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

  private

  def set_track
    if params[:id]
      @track = Track.find(params[:id])
    else
      @artist = User.friendly.find(params[:artist])
      @track = @artist.tracks.friendly.find(params[:track])
    end
  end

  def encode_peaks(peaks)
    base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    encoded = ''

    samples = []
    (peaks.length / 8).times do |i|
      samples.push(sample_peaks(peaks.slice(i * 8, 8)))
    end
    max = samples.max
    min = samples.min

    samples.each do |sample|
      normalized = (sample.to_f - min) / (max - min)
      encoded += base64[(normalized * 63).floor]
    end
    encoded
  end

  def sample_peaks(slice)
    slice.map(&:abs).sum / slice.length
  end

  def track_params
    params.require(:track).permit(:title, :description, :downloadable,
                                  :owner_id, :thumbnail, :original, :uploaded, :submitted, :processing)
  end

  def start_processing
    require 'aws-sdk-lambda'
    config = Rails.application.config.transcoder

    jwt = encode_jwt({
                       iss: 'juke',
                       exp: (Time.now.to_i + 3600),
                       sub: 'juke-transcoder'
                     })

    outputs = config.specs.map do |spec|
      spec[:metadata] = config.metadata
      spec[:upload] = {
        type: 'rails',
        url: config.host + rails_direct_uploads_path,
        headers: { Authorization: "bearer #{jwt}" },
        name: "#{@track.id}.#{spec[:extension]}",
        extension: spec[:extension]
      }
      spec
    end

    callback = {
      url: config.host + "/tracks/#{@track.id}/streams",
      headers: { Authorization: "bearer #{jwt}" },
      method: 'POST'
    }

    payload = {
      peaks: config.peaks,
      input: {
        download: {
          url: config.host + rails_blob_path(@track.original)
        }
      },
      outputs: outputs,
      callback: callback
    }

    client = Aws::Lambda::Client.new(**config.client)

    client.invoke({
                    payload: ActiveSupport::JSON.encode(payload),
                    function_name: config.function,
                    invocation_type: 'Event'
                  })

    @track.update(processing: 'started')
  end
end
