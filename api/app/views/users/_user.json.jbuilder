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
