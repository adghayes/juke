# == Schema Information
#
# Table name: plays
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  track_id   :bigint           not null
#
# Indexes
#
#  index_plays_on_track_id  (track_id)
#
# Foreign Keys
#
#  fk_rails_...  (track_id => tracks.id)
#
require 'rails_helper'

RSpec.describe Play, type: :model do
  it { should belong_to(:track) }
end
