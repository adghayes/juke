# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :citext           not null
#  display_name    :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  bio             :text
#  slug            :string
#
# Indexes
#
#  index_users_on_display_name  (display_name) UNIQUE
#  index_users_on_email         (email) UNIQUE
#
FactoryBot.define do
  factory :user do
    email { Faker::Internet.unique.safe_email }
    display_name { Faker::Internet.unique.username }
    password { 'password' }
    bio { Random.rand > 0.5 ? Faker::Lorem.sentence : ''}
  end
end
