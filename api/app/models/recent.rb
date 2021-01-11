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
class Recent < ApplicationRecord
  validates_uniqueness_of :track_id, scope: :user_id

  belongs_to :user
  belongs_to :track

  LENGTH = 10

  def self.log(user, track)
    existing = self.find_by(user: user, track: track)
    return if existing

    num_recents = user.recents.count
    self.transaction do
      user.recents.create(track: track)
      if num_recents >= LENGTH
        user.recents.order(:created_at).limit(1).destroy_all
      end
    end

  end
end
