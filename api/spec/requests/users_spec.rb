# frozen_string_literal: true

require 'rails_helper'

valid_create = {
  user: {
    email: 'hello@gmail.com',
    display_name: 'hello',
    password: 'password'
  }
}

RSpec.describe 'Users', type: :request do
  def auth_header
    @user ||= FactoryBot.create(:user)
    @session = Session.for(@user)
    { Authorization: "bearer #{@session.token}" }
  end

  def expect_track_in_queue(response, track)
    body = JSON.parse(response.body)
    tracks = body['tracks']
    expect(tracks.any? { |x| x['id'] = track.id }).to be true
  end

  describe 'POST /create' do
    context 'valid payload' do
      it 'creates a new user' do
        post '/users', params: valid_create, as: :json
        created = User.find_by(email: valid_create[:user][:email])
        expect(created).not_to be_nil
      end

      it 'logs in the new user' do
        post '/users', params: valid_create, as: :json
        created = User.find_by(email: valid_create[:user][:email])
        expect(created.sessions.where(active: true).to_a).not_to be_empty
      end

      it 'responds with new user data' do
        post '/users', params: valid_create, as: :json
        expect(response).to have_http_status(:created)

        body = JSON.parse(response.body)
        expect(body['user']).to be_truthy
        expect(body['token']).to be_truthy
      end
    end

    context 'invalid payload' do
      it 'has status unprocessable' do
        post '/users', params: { user: { email: 'bad_email' } }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET' do
    describe '/user' do
      context 'user is anonymous' do
        it 'is unauthorized' do
          get '/user'
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context 'user is logged in' do
        it 'gives all _user view attributes' do
          get '/user', headers: auth_header
          expect(response).to have_http_status(:ok)
          body = JSON.parse(response.body)
          expect(body['display_name']).to eq(@user.display_name)
          expect(body['id']).to eq(@user.id)
          expect(body['bio']).to eq(@user.bio)
          expect(body['slug']).to eq(@user.slug)
          expect(body['track_ids']).to eq(@user.track_ids)
          expect(body['recent_track_ids']).to eq(@user.recent_track_ids)
          expect(body['liked_track_ids']).to eq(@user.liked_track_ids)
        end
      end
    end

    describe '/users/[:id]' do
      before do
        @user = FactoryBot.create(:user_with_recents)
        get "/users/#{@user.slug}"
        @body = JSON.parse(response.body)
      end

      it 'provides user data' do
        expect(response).to have_http_status(:ok)
        expect(@body['id']).to eq(@user.id)
      end

      it 'does not include listening history' do
        expect(@body['recent_track_ids']).to be_empty
      end
    end
  end

  describe 'PATCH /update' do
    before { @user = FactoryBot.create(:user) }

    context 'wrong user' do
      it 'is forbidden' do
        patch "/users/#{FactoryBot.create(:user).id}",
              params: { user: { bio: 'change' } },
              headers: auth_header,
              as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context 'valid update' do
      it 'returns the user' do
        patch "/users/#{@user.id}",
              params: { user: { bio: 'change' } },
              headers: auth_header,
              as: :json
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['bio']).to eq('change')
      end
    end

    context 'invalid update' do
      it 'is unprocessable status' do
        patch "/users/#{@user.id}",
              params: { user: { bio: 'c' * 200 } },
              headers: auth_header,
              as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET /tracks' do
    it 'returns a users track' do
      @user = FactoryBot.create(:user)
      @track = FactoryBot.create(:track_live, owner: @user)
      get "/users/#{@user.id}/tracks"
      expect_track_in_queue(response, @track)
    end
  end

  describe 'GET /likes' do
    it 'returns a users like' do
      @user = FactoryBot.create(:user)
      @track = FactoryBot.create(:track_live, owner: @user)
      FactoryBot.create(:like, track: @track, user: @user)
      get "/users/#{@user.id}/likes"
      expect_track_in_queue(response, @track)
    end
  end

  describe 'GET /recents' do
    it 'returns a users own recent' do
      @user = FactoryBot.create(:user)
      @track = FactoryBot.create(:track_live, owner: @user)
      FactoryBot.create(:recent, track: @track, user: @user)
      get "/users/#{@user.id}/history", headers: auth_header
      expect_track_in_queue(response, @track)
    end

    it 'does not allow accessing others history' do
      user = FactoryBot.create(:user)
      track = FactoryBot.create(:track_live, owner: user)
      FactoryBot.create(:recent, track: track, user: user)
      get "/users/#{user.id}/history", headers: auth_header
      expect(response).to have_http_status(:forbidden)
    end
  end
end
