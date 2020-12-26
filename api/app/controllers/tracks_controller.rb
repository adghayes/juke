class TracksController < ApplicationController
  before_action :require_logged_in, only: [:create, :update]
  before_action :require_valid_jwt, only: 
  
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
        process_original if params[:event_type] == 'upload_complete'
      else
        render json: @track.errors.messages, status: :unprocessable_entity
      end
    else
      head :forbidden
    end
  end

  def streams

  end

  private

  def track_params
    params.require(:track).permit(:title, :description, :downloadable, :owner_id, :thumbnail, :original)
  end

  def process_original
    require 'aws-sdk-lambda'
    config = Rails.application.config.transcoder

    jwt = encode_jwt({
      iss: 'noisepuff-api',
      exp: (Time.now.to_i + 3600),
      sub: 'noisepuff-transcoder'
    })

    outputs = config.specs.map do |spec|
      spec.metadata = config.metadata
      spec.destination = {
        type: 'rails_direct_upload',
        url: rails_direct_uploads_url,
        headers: { Authorization: "bearer #{jwt}" },
        filename: "#{@track.id}.#{spec.format}"
      }
    end

    callback = {
      url: streams_track_url(@track),
      headers: { Authorization: "bearer #{jwt}" },
      method: "POST"
    }

    payload = {
      peaks: 600,
      input: {
        source: rails_blob_url(@track.original, disposition: "attachment")
      }, 
      outputs: outputs,
      callback: callback
    }

    client = Aws::Lambda::Client.new(**config.client)

    puts payload
    client.invoke({
      payload: ActiveSupport::JSON.encode(payload),
      function_name: 'ffmpeg-microservice',
      invocation_type: 'Event'
    })
  end
end
