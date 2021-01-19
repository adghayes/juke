# frozen_string_literal: true

require 'tempfile'

def weighted_sample(arr)
  size = arr.length
  idx = ((Random.rand + Random.rand) / 2 * size).floor
  arr[idx]
end

def seed_dependents(users, tracks)
  num_users = users.length
  num_tracks = tracks.length

  num_likes = num_users * 10
  num_recents = num_users * 10
  num_plays = num_users * 25

  users.shuffle!
  tracks.shuffle!

  num_likes.times do
    Like.find_or_create_by(user: weighted_sample(users),
                           track: weighted_sample(tracks),
                           created_at: Faker::Time.backward(days: 14))
  end

  num_plays.times do
    Play.create(track: weighted_sample(tracks), created_at: Faker::Time.backward(days: 14))
  end

  num_recents.times do
    users.sample.listen tracks.sample
  end
end

def seed_file(s3_client, key)
  Tempfile.create(['juke_', File.extname(key)]) do |file|
    file.binmode
    s3_client.get_object(
      bucket: 'juke-seed',
      key: key,
      response_target: file.path
    )
    file.rewind
    yield(file)
  end
end
