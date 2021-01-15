
def seed_dependents(users, tracks)
  num_users = users.length
  num_tracks = tracks.length
  
  num_likes = num_users * 10
  num_plays = num_users * num_tracks
  num_recents = num_users * 10

  num_likes.times do 
    Like.find_or_create_by(user: users.sample, 
      track: tracks.sample, 
      created_at: Faker::Time.backward(days: 14))
  end

  num_plays.times  do 
    Play.create(track: tracks.sample, created_at: Faker::Time.backward(days: 14))
  end

  num_recents.times do 
    users.sample.listen tracks.sample
  end
end
