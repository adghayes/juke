json.display_name user.display_name
json.id user.id
json.bio user.bio
json.slug user.slug

if user.avatar.attached?
  json.avatar url_for(user.avatar)
end

if user == current_user
  json.email user.email
end

json.track_ids user.track_ids

json.liked_track_ids user.liked_track_ids

json.history user.history_track_ids(10)
