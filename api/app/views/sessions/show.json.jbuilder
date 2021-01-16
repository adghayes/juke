# frozen_string_literal: true

json.token @token

json.user do
  json.partial! 'users/user', user: @user
end
