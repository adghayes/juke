require 'aws-sdk-s3'
require 'tempfile'

require_relative './seeds_helper.rb'

@num_seed_bots = 3
@num_seed_tracks = 10

s3_client = Aws::S3::Resource.new(region: "ca-central-1").client
seed_keys = s3_client.list_objects({ bucket: 'juke-seeds' }).contents.map { |struct| struct.key }

track_keys = []
image_keys = []
seed_keys.each do |key|
  if key.starts_with? "tracks/"
    track_keys.push(key)
  elsif key.starts_with? "images/"
    image_keys.push(key)
  end
end

@seed_bots = []
@num_seed_bots.times do |i|
  avatar_key = image_keys.sample
  Tempfile.create(['juke_', File.extname(avatar_key)]) do |avatar|
    avatar_key = image_keys.sample

    avatar.binmode
    s3_client.get_object(
      bucket: 'juke-seeds',
      key: avatar_key,
      response_target: avatar.path
    )
    avatar.rewind

    @seed_bots.push FactoryBot.create(:user, 
      display_name: "Seedbot #{Random.rand(100)}", 
      avatar: avatar,
      created_at: Faker::Time.backward(days: 14)
    )
  end
end

track_keys.shuffle!
@seed_tracks = []
@num_seed_tracks.times do |i|
  track_key = track_keys[i]
  track_title = track_key.remove(/^tracks\//).remove(/\.[^\.]*$/).gsub('_',' ')

  Tempfile.create(['juke_', File.extname(track_key)]) do |track|
    track.binmode
    s3_client.get_object(
      bucket: 'juke-seeds',
      key: track_key,
      response_target: track.path
    )
    track.rewind

    thumbnail_key = image_keys.sample
    Tempfile.create(['juke_', File.extname(thumbnail_key)]) do |thumbnail|
      thumbnail.binmode
      s3_client.get_object(
        bucket: 'juke-seeds',
        key: thumbnail_key,
        response_target: thumbnail.path
      )
      thumbnail.rewind

      @seed_tracks.push FactoryBot.create(:track_live, 
        owner: @seed_bots.sample,
        title: track_title,
        streams: [track],
        thumbnail: thumbnail,
        created_at: Faker::Time.backward(days: 14)
      )
    end
  end
end

@num_users = 25
@users = (1..@num_users).to_a.map do |i|
  FactoryBot.create(:user)
end

@users.push(*@seed_bots)

seed_dependents @users, @seed_tracks
