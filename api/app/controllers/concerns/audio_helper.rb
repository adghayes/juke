# frozen_string_literal: true

module AudioHelper
  extend ActiveSupport::Concern
  include Rails.application.routes.url_helpers
  include Auth

  def jwt
    encode_jwt({
                 iss: 'juke',
                 exp: (Time.now.to_i + 3600),
                 sub: 'juke-transcoder'
               })
  end

  def config
    Rails.application.config.transcoder
  end

  def input(track)
    {
      download: {
        url: config.host + rails_blob_path(track.original)
      }
    }
  end

  def outputs(track)
    config.specs.map do |spec|
      spec[:metadata] = config.metadata
      spec[:upload] = {
        type: 'rails',
        url: config.host + rails_direct_uploads_path,
        headers: { Authorization: "bearer #{jwt}" },
        name: "#{track.id}.#{spec[:extension]}",
        extension: spec[:extension]
      }
      spec
    end
  end

  def callback(track)
    {
      url: config.host + "/tracks/#{track.id}/streams",
      headers: { Authorization: "bearer #{jwt}" },
      method: 'POST'
    }
  end

  def event(track)
    {
      peaks: config.peaks,
      input: input(track),
      outputs: outputs(track),
      callback: callback(track)
    }
  end

  def process_audio(track)
    require 'aws-sdk-lambda'
    client = Aws::Lambda::Client.new(**config.client)

    client.invoke(
      {
        payload: JSON.unparse(event(track)),
        function_name: config.function,
        invocation_type: 'Event'
      }
    )

    track.update(processing: 'started')
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
end
