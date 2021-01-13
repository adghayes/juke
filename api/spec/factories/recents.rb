# == Schema Information
#
# Table name: recents
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  track_id   :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_recents_on_track_id              (track_id)
#  index_recents_on_user_id               (user_id)
#  index_recents_on_user_id_and_track_id  (user_id,track_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (track_id => tracks.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :recent do
    user { association :user }
    track { association :track }
    created_at { Faker::Time.backward(days: 14) }
  end
end
