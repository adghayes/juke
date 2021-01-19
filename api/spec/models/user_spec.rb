# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :citext           not null
#  display_name    :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  bio             :text
#  slug            :string
#
# Indexes
#
#  index_users_on_display_name  (display_name) UNIQUE
#  index_users_on_email         (email) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { FactoryBot.create(:user) }

  describe 'validations' do
    describe 'validates email format' do
      it { is_expected.to allow_value('user@gmail.com').for(:email) }
      it { is_expected.not_to allow_value('').for(:email) }
      it { is_expected.not_to allow_value('mrman.com').for(:email) }
      it { is_expected.not_to allow_value('@email.com').for(:email) }
    end

    it do
      expect(subject).to validate_uniqueness_of(:email)
        .case_insensitive
        .with_message("That's already taken")
    end

    it { is_expected.to validate_length_of(:display_name).is_at_least(3).is_at_most(20) }

    it do
      expect(subject).to validate_uniqueness_of(:display_name)
        .with_message("That's already taken")
    end

    it { is_expected.to validate_presence_of(:password_digest) }

    it { is_expected.to validate_length_of(:password).is_at_least(8).allow_nil }

    it { is_expected.to validate_length_of(:bio).is_at_most(160) }
  end

  describe 'associations' do
    it { is_expected.to have_many(:sessions) }
    it { is_expected.to have_many(:tracks) }
    it { is_expected.to have_many(:likes) }
    it { is_expected.to have_many(:recents) }
    it { is_expected.to have_many(:liked_tracks) }
    it { is_expected.to have_many(:recent_tracks) }
    it { is_expected.to have_one_attached(:avatar) }
  end

  describe '#password=' do
    it 'changes the value of the password and password digest' do
      init_password = user.password
      init_digest = user.password_digest
      user.password = 'new_password'
      expect(user.password).not_to eql(init_password)
      expect(user.password_digest).not_to eql(init_digest)
    end
  end

  describe '#is_password?' do
    it 'matches the correct password' do
      expect(user.is_password?('password')).to be true
    end

    it "doesn't match something else" do
      expect(user.is_password?('wrong_password')).to be false
    end
  end

  describe '::find_by_credentials' do
    it 'identifies a user by credentials' do
      expect(described_class.find_by_credentials(user.email, user.password)).to eq user
    end

    it 'returns nil for password mismatch' do
      expect(described_class.find_by_credentials(user.email, 'wrong_password')).to be nil
    end

    it 'returns nil for non-existent email' do
      expect(described_class.find_by_credentials(Faker::Internet.unique.safe_email, 'password')).to be nil
    end
  end

  describe '#listen' do
    let(:user_with_recents) { FactoryBot.create(:user_with_recents) }
    let(:initial_recents) { user_with_recents.recents }
    let(:track) { FactoryBot.create(:track) }

    it 'does nothing if recent already exists' do
      recent_track = user_with_recents.recents.first.track
      user_with_recents.listen(recent_track)
      expect(user_with_recents.recents.to_a).to match_array(initial_recents.to_a)
    end

    it 'creates a new recent linking track and user' do
      user_with_recents.listen(track)
      expect(user_with_recents.recent_tracks).to include(track)
    end

    it 'deletes the oldest recent if there are too many' do
      oldest = initial_recents.order(:created_at).first
      user_with_recents.listen(track)
      expect { oldest.reload }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end
end
