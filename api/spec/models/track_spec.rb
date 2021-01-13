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
  describe 'validations' do
    it do
      should validate_uniqueness_of(:slug)
        .scoped_to(:owner_id)
        .allow_nil
    end 

    it do 
      should validate_uniqueness_of(:title)
        .allow_nil
        .scoped_to(:owner_id)
        .with_message('You already have a track with that title') 
    end

    context 'when submitted' do
      subject { FactoryBot.build(:track, submitted: true)}
      it { should validate_presence_of(:title) }
      it { should validate_presence_of(:slug) }
    end

    context 'when processed' do
      subject { FactoryBot.build(:track, processing: "done") }
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

  describe '#should generate_new_friendly_id?' do
    context 'title is not changed' do
      it 'should be false' do
        
      end
    end
  end
end