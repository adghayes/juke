# frozen_string_literal: true

count = 0

json.tracks do
  json.array! @tracks do |track|
    json.partial! 'tracks/track', track: track
    count += 1
  end
end

json.next @path + "?limit=#{@limit}&latest=#{@oldest}" if count >= @limit
