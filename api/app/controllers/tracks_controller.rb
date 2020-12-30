class TracksController < ApplicationController
  before_action :require_logged_in, only: [:create, :update]
  before_action :require_valid_jwt, only: :streams
  
  def create
    @track = Track.new(owner: current_user, **track_params)
    if @track.save
      render :show
    else
      render json: @track.errors.messages, status: :unprocessable_entity
    end
  end

  def show
    set_track
    render :show
  end

  def update
    set_track
    if @track.owner == current_user
      if @track.update(track_params)
        start_processing if params[:event] == 'uploaded'
        render :show
      else
        render json: @track.errors.messages, status: :unprocessable_entity
      end
    else
      head :forbidden
    end
  end

  def streams
    set_track
    if params[:status] != 200
      @track.update(processing: 'error')
      head :ok
    end

    @track.peaks = scale_peaks(params[:peaks])
    @track.duration = params[:input][:metadata][:format][:duration]

    signed_blob_ids = []
    params[:outputs].each do |output|
      signed_blob_ids.push output[:id] if output[:id]
    end

    @track.streams.attach signed_blob_ids

    @track.processing = "done"
    if @track.save
      head :ok
    else
      head :unprocessable_entity
    end
  end

  private

  def set_track
    @track = Track.find(params[:id])
  end

  def scale_peaks(raw)
    scaled = []
    (raw.length / 2).times do |i|
      scaled.push (raw[i].abs + raw[i + 1].abs)
    end
    max = scaled.max
    scaled.map { |peak| (256.0 / max * peak).floor }
  end

  def parse_duration(duration)
    sum = 0
    parts = duration.split(':')
    parts.length.times do | i |
      sum += parts[parts.length - 1 - i].to_f * 60 ** i
    end
    sum
  end

  def track_params
    params.require(:track).permit(:title, :description, :downloadable, 
      :owner_id, :thumbnail, :original, :uploaded, :submitted, :processing)
  end

  def start_processing
    require 'aws-sdk-lambda'
    config = Rails.application.config.transcoder

    jwt = encode_jwt({
      iss: 'noisepuff-api',
      exp: (Time.now.to_i + 3600),
      sub: 'noisepuff-transcoder'
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
      url: config.host + streams_track_path(@track),
      headers: { Authorization: "bearer #{jwt}" },
      method: "POST"
    }

    payload = {
      peaks: config.peaks,
      input: {
        download: {
          url: config.host + rails_blob_path(@track.original, disposition: "attachment")
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
