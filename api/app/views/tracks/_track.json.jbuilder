json.id track.id
json.title track.title
json.slug track.slug
json.description track.description
json.owner do 
  json.display_name track.owner.display_name
  json.id track.owner.id
  json.slug track.owner.slug
end

if track.thumbnail.attached?
  json.thumbnail url_for(track.thumbnail)
end

if track.status != 'ready'
  json.status track.status
end

