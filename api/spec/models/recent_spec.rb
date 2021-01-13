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
require 'rails_helper'

RSpec.describe Recent, type: :model do
  subject(:recent) { FactoryBot.create(:recent) }

  describe 'validations' do 
    it { should validate_uniqueness_of(:user).scoped_to(:track_id) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should belong_to(:track) }
  end
end
