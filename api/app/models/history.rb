# == Schema Information
#
# Table name: histories
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  track_id   :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_histories_on_created_at  (created_at)
#  index_histories_on_track_id    (track_id)
#  index_histories_on_user_id     (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (track_id => tracks.id)
#  fk_rails_...  (user_id => users.id)
#
class History < ApplicationRecord
  belongs_to :user
  belongs_to :track
end
