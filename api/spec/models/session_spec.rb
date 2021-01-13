# == Schema Information
#
# Table name: sessions
#
#  id         :bigint           not null, primary key
#  active     :boolean          default(TRUE), not null
#  browser    :string
#  device     :string
#  location   :string
#  token      :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_sessions_on_token    (token) UNIQUE
#  index_sessions_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe Session, type: :model do
  let(:user) { FactoryBot.create(:user) }
  subject(:session) { FactoryBot.create( :session) }

  describe "validations" do
    it { should validate_uniqueness_of(:token) }
  end

  describe "associations" do
    it { should belong_to(:user) }
  end

  describe "::generate_token" do
    it 'generates a base64 token of length 24' do
      expect(Session.generate_token).to match(/[a-zA-Z0-9+\/]{24}/)
    end
  end

  describe "#deactivate!" do
    it 'sets active to false' do
      expect(session.active).to be true
      session.deactivate!
      expect(session.active).to be false
    end
  end

  describe "::for" do
    it 'creates a session for a user' do
      expect(user.sessions).to match_array([])
      user_session = Session.for(user)
      expect(user_session.persisted?).to be true
      expect(user.reload.sessions.to_a).to include(user_session)
    end

    it 'adds details about the session if provided' do
      device = 'MacBook Pro'
      browser = 'Chrome'
      details_session = Session.for(user, device: device, browser: browser)
      expect(details_session.device).to eq device
      expect(details_session.browser).to eq browser
    end
  end
end
