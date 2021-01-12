@attachment_dir = File.join(Rails.root, 'spec', 'attachments')

def get_files(dir)
  Dir.entries(dir)
    .filter { |basename| !['.','..','.DS_Store'].include?(basename) } 
    .map { |basename| File.join(dir, basename) }
end

@avatars = get_files(File.join(@attachment_dir, 'avatars'))

User.create([
  { email: 'appa@gmail.com', display_name: 'appa', password: 'password' },
  { email: 'momo@gmail.com', display_name: 'momo', password: 'password' }
])

10.times do
  FactoryBot.create(:user, avatar: @avatars[Random.rand(@avatars.length)])
end

@num_users = User.count

def random_user
  User.limit(1).offset(Random.rand(@num_users)).first
end

@music = get_files(File.join(@attachment_dir, 'music'))
@thumbnails = get_files(File.join(@attachment_dir, 'thumbnails'))

@music.each do |file|
  FactoryBot.create(:track, file: file, thumbnail: @thumbnails[Random.rand(@thumbnails.length)])
end

@num_tracks = Track.count

def random_track
  Track.limit(1).offset(Random.rand(@num_tracks)).first
end

@num_likes = @num_users * @num_tracks / 4
@num_plays = @num_users * @num_tracks * 2
@num_recents = @num_users * 5

@num_likes.times { Like.find_or_create_by(user: random_user, track: random_track, created_at: Faker::Time.backward(days: 14))}
@num_plays.times  do 
  track = random_track
  created_at = Faker::Time.backward(days: 14)
  Play.create(track: track, created_at: created_at)
end

@num_recents.times do 
  Recent.log(random_user, random_track)
end
