# frozen_string_literal: true

require_relative './seeds_helper'

num_users = 25
num_tracks = 50
image_path = File.join(Rails.root, 'spec', 'attachments', 'goku.jpeg')
audio_path = File.join(Rails.root, 'spec', 'attachments', 'cantina.mp3')

users = (1..num_users).to_a.map do |_i|
  FactoryBot.create(:user, avatar: File.open(image_path))
end

tracks = (1..num_tracks).to_a.map do |_i|
  FactoryBot.create(:track_live,
                    owner: users.sample,
                    thumbnail: File.open(image_path),
                    streams: [File.open(audio_path)],
                    created_at: Faker::Time.backward(days: 14))
end

seed_dependents users, tracks
