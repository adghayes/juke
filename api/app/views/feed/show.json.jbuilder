oldest = DateTime.now

json.tracks do 
  json.array! @tracks do |track|
    json.partial! 'tracks/track', track: track
    oldest = track.created_at if track.created_at < oldest
  end
end

json.next feed_url + "?limit=#{@limit}&latest=#{oldest.iso8601}"
