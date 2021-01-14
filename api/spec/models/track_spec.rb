# == Schema Information
#
# Table name: tracks
#
#  id           :bigint           not null, primary key
#  description  :text
#  downloadable :boolean          default(FALSE)
#  duration     :float
#  peaks        :text
#  processing   :string
#  slug         :string
#  submitted    :boolean          default(FALSE)
#  title        :string
#  uploaded     :boolean          default(FALSE)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  owner_id     :bigint           not null
#
# Indexes
#
#  index_tracks_on_created_at          (created_at)
#  index_tracks_on_owner_id_and_title  (owner_id,title) UNIQUE
#  index_tracks_on_title               (title)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#

RSpec.describe Track, type: :model do
  subject(:track)  { FactoryBot.create(:track) }

  describe 'validations' do
    context 'when submitted' do
      it { should validate_presence_of(:title) }
      it do 
        should validate_uniqueness_of(:title)
          .scoped_to(:owner_id)
          .with_message('You already have a track with that title') 
      end
    end

    context 'when processed' do
      subject { FactoryBot.create(:track_live) }
      it { should validate_presence_of(:peaks) }
      it { should validate_presence_of(:duration) }
    end

    it { should validate_length_of(:description).is_at_most(160) }
  end

  describe 'associations' do
    it { should belong_to(:owner) }
    it { should have_many(:likes) }
    it { should have_many(:plays) }
    it { should have_one(:stats) }
    it { should have_one_attached(:thumbnail) }
    it { should have_one_attached(:original) }
    it { should have_many_attached(:streams) }
  end

  describe '#should_generate_new_friendly_id?' do
    context 'title is not changed' do
      it 'should be false' do
        expect(track.should_generate_new_friendly_id?).to be false
      end
    end

    context 'title has changed' do
      it 'should be true' do
        track.title = track.title + " changed"
        expect(track.should_generate_new_friendly_id?).to be true
      end
    end
  end

  describe '#live?' do
    context 'submitted and unprocessed track' do
      it 'should be false' do
        expect(track.live?).to be(false)
      end
    end

    context 'processed and unsubmitted track' do
      it 'should be true' do
        expect(FactoryBot.create(:track_live, submitted: false).live?).to be(false)
      end
    end

    context 'processed and submitted track' do
      it 'should be true' do
        expect(FactoryBot.create(:track_live).live?).to be(true)
      end
    end
  end

  describe '#listen' do
    it 'creates a new play record' do
      initial_count = track.plays.count
      track.listen
      expect(track.plays.count).to be (initial_count + 1)
    end
  end
end
