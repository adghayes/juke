# frozen_string_literal: true

require_relative './seeds_helper'
image_path = File.join(Rails.root, 'spec', 'attachments', 'goku.jpeg')

num_users = 25
num_tracks = 50

users = []
num_users.times do
  users.push FactoryBot.create(:user, avatar: File.open(image_path))
end

tracks = []
num_tracks.times do
  tracks.push FactoryBot.create(:track_live,
                                owner: users.sample,
                                created_at: Faker::Time.backward(days: 14))
end

seed_dependents users, tracks
