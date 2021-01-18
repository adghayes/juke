# frozen_string_literal: true

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
  sequence :email do |n|
    "#{n}#{Faker::Internet.safe_email}"
  end

  sequence :display_name do |n|
    "#{Faker::Internet.username(specifier: 3..20)}#{n}"
  end

  factory :user do
    transient do
      avatar { nil }
    end

    email { generate :email }
    display_name { generate :display_name }
    password { 'password' }
    bio { Faker::Lorem.sentence }

    factory :user_with_recents do
      transient do
        recents_count { Recent::LENGTH }
      end

      after(:create) do |user, evaluator|
        FactoryBot.create_list(:recent, evaluator.recents_count, user: user)
      end
    end

    after(:build) do |user, evaluator|
      if evaluator.avatar
        avatar = evaluator.avatar
        avatar_name = File.basename(avatar.path)
        user.avatar.attach(io: avatar, filename: avatar_name,
                           content_type: MIME::Types.type_for(avatar_name)[0].to_s)
      end
    end
  end
end
