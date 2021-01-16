# frozen_string_literal: true

json.display_name user.display_name
json.id user.id
json.bio user.bio
json.slug user.slug
json.track_ids user.track_ids

json.liked_track_ids user.liked_track_ids
json.recent_track_ids(user == current_user ? user.recent_track_ids : [])

json.avatar url_for(user.resized_avatar) if user.avatar.attached?
