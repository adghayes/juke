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
    transient do 
      avatar { true }
    end

    email { Faker::Internet.unique.safe_email }
    display_name { Faker::Games::SuperSmashBros.unique.fighter }
    password { 'password' }
    bio { Random.rand > 0.5 ? Faker::Lorem.sentence : ''}

    after(:build) do |user, evaluator|
      user.avatar.attach(io: File.open(evaluator.avatar), filename: File.basename(evaluator.avatar), 
        content_type: MIME::Types.type_for(evaluator.avatar)[0].to_s)
    end
  end
end