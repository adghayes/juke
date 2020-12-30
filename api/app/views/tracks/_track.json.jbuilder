json.id track.id
json.title track.title
json.slug track.slug

json.owner do 
  json.display_name track.owner.display_name
  json.id track.owner.id
  json.slug track.owner.slug
end

if track.thumbnail.attached?
  json.thumbnail url_for(track.thumbnail)
end

if detailed
  json.description track.description
  json.peaks track.peaks
  json.duration track.duration
end

if track.owner == current_user
  json.live track.live?
  json.processing track.processing
  json.uploaded track.uploaded
  json.submitted track.submitted
end

