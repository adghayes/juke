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

json.tracks user.track_ids
json.likes user.likes.pluck(:track_id)
json.histories user.histories.pluck(:track_id)
