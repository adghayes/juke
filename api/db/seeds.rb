
likes_per_user = 3

User.create([
  { email: 'appa@gmail.com', display_name: 'appa', password: 'password' },
  { email: 'momo@gmail.com', display_name: 'momo', password: 'password' }
])

5.times do
  FactoryBot.create(:user)
end

@num_users = User.count

def random_user
  User.limit(1).offset(Random.rand(@num_users)).first
end

@music_dir = File.join(Rails.root, 'spec', 'attachments', 'music')
Dir.entries(@music_dir).filter { |filename| !['.','..'].include?(filename) } .each do |filename|
  FactoryBot.create(:track, filename: filename)
end

@num_tracks = Track.count

def random_track
  Track.limit(1).offset(Random.rand(@num_tracks)).first
end

@num_likes = @num_users * @num_tracks / 4
@num_listens = @num_users * @num_tracks

@num_likes.times { Like.find_or_create_by(user: random_user, track: random_track, created_at: Faker::Time.backward(days: 14))}
@num_listens.times { History.find_or_create_by(user: random_user, track: random_track, created_at: Faker::Time.backward(days: 14))}


