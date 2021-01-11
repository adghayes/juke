oldest = DateTime.now
count = 0


json.tracks do 
  json.array! @tracks do |track|
    json.partial! 'tracks/track', track: track
    oldest = track.created_at if track.created_at < oldest
    count += 1
  end
end

if count >= @limit
  json.next feed_path + "?limit=#{@limit}&latest=#{oldest.iso8601}"
end
