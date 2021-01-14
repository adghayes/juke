json.display_name user.display_name
json.id user.id
json.bio user.bio
json.slug user.slug
json.track_ids user.track_ids

json.liked_track_ids user.liked_track_ids

if user == current_user
  json.recent_track_ids user.recent_track_ids
  json.email user.email
end

if user.avatar.attached?
  json.avatar url_for(user.avatar)
end