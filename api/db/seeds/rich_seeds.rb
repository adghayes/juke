# frozen_string_literal: true

require 'aws-sdk-s3'
require 'tempfile'

require_relative './seeds_helper'

@num_seed_tracks = ENV['NUM_SEED_TRACKS'].to_i
@num_seed_bots = @num_seed_tracks / 3

s3_client = Aws::S3::Resource.new(region: 'us-east-1').client
seed_keys = s3_client.list_objects({ bucket: 'juke-seed' }).contents.map(&:key)

stream_keys = []
image_keys = []
seed_keys.each do |key|
  if key.starts_with? 'tracks/streams/'
    stream_keys.push(key)
  elsif key.starts_with? 'images/'
    image_keys.push(key)
  end
end

@seed_bots = []
@num_seed_bots.times do |i|
  avatar_key = image_keys.sample
  seed_file(s3_client, avatar_key) do |avatar|
    @seed_bots.push FactoryBot.create(:user,
      display_name: "Seedbot #{i + 1}",
      avatar: avatar,
      created_at: Faker::Time.backward(days: 14))
  end
end

stream_keys.shuffle!
@seed_tracks = []
@num_seed_tracks.times do |i|
  stream_key = stream_keys[i]
  title = stream_key.remove(%r{^tracks/streams/}).remove(/\.[^.]*$/).gsub('_', ' ')
  thumbnail_key = image_keys.sample

  seed_file(s3_client, stream_key) do |stream|
    seed_file(s3_client, thumbnail_key) do |thumbnail|
      downloadable = Faker::Boolean.boolean(true_ratio: 0.2)
      track = FactoryBot.create(:track_live,
        owner: @seed_bots.sample,
        title: title,
        streams: [stream],
        thumbnail: thumbnail,
        downloadable: downloadable,
        created_at: Faker::Time.backward(days: 14))
      
      @seed_tracks.push track
    end
  end
end

@num_users = 25
@users = (1..@num_users).to_a.map do |_i|
  FactoryBot.create(:user)
end

@users.push(*@seed_bots)

seed_dependents @users, @seed_tracks
