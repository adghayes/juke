json.id track.id
json.title track.title
json.slug track.slug

json.owner do 
  json.display_name track.owner.display_name
  json.id track.owner.id
  json.slug track.owner.slug
  if track.owner.avatar.attached?
    json.avatar url_for(track.owner.avatar)
  end
end

if track.thumbnail.attached?
  json.thumbnail url_for(track.thumbnail)
end

if track.streams.attached?
  json.src track.streams.map { |stream| url_for(stream) }
end

json.description track.description
json.peaks track.peaks
json.duration track.duration

if current_user == track.owner
  json.live track.live?
  json.processing track.processing
  json.uploaded track.uploaded
  json.submitted track.submitted
end

json.num_likes track.stats.likes_count
json.num_listens track.stats.listens_count

json.created track.created_at

