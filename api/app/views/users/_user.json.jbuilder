json.display_name user.display_name
json.id user.id
if user == current_user
  json.email user.email
end
