# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Tracks', type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:session) { Session.for(user) }
  let(:auth_header) { { 'Authorization' => "bearer #{session.token}" } }

  let(:track) { FactoryBot.create(:track_live, owner: user) }

  describe 'POST /create' do
    context 'logged in' do
      it 'creates a new Track' do
        expect do
          post tracks_url, params: { track: { submitted: false } }, headers: auth_header
        end.to change(Track, :count).by(1)
      end

      it 'renders a JSON response with the new track' do
        post tracks_url, params: { track: { submitted: false } }, headers: auth_header
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['id']).to be_truthy
      end
    end

    context 'not logged in' do
      it 'does not create a new Track' do
        expect do
          post tracks_url
        end.to change(Session, :count).by(0)
      end

      it 'has status unauthorized' do
        post tracks_url
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /show' do
    it 'provides data on track in json body' do
      get "/tracks/#{track.id}"
      expect(response).to have_http_status(:ok)
      body = JSON.parse(response.body)
      %w[id title slug owner src description peaks duration num_likes num_plays created].each do |key|
        expect(body.keys).to include(key)
      end
    end
  end

  describe 'PATCH /update' do
    context 'owner of track' do
      it 'updates the track' do
        patch track_url(track.id),
              params: { track: { description: 'change' } },
              headers: auth_header,
              as: :json
        expect(track.reload.description).to eq('change')
      end
    end

    context 'another user' do
      it 'is forbidden' do
        other = FactoryBot.create(:user)
        other_session = Session.for(other)
        patch track_url(track.id),
              headers: { 'Authorization' => "bearer #{other_session.token}" }
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'POST /like' do
    it 'creates like if there is none' do
      post like_track_url(track.id), headers: auth_header
      like = Like.find_by(user: user, track: track)
      expect(like).to_not be_nil
    end

    it 'does nothing if like exists' do
      like = Like.create(user: user, track: track)
      expect do
        post like_track_url(track.id), headers: auth_header
      end.to change(Like, :count).by(0)
      expect(like.reload.persisted?).to be true
    end
  end

  describe 'DELETE /like' do
    it 'destroys the like' do
      like = Like.create(user: user, track: track)
      expect do
        delete like_track_url(track.id), headers: auth_header
      end.to change(Like, :count).by(-1)
      expect do
        like.reload
      end.to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'does nothing if like does not exist' do
      expect do
        delete like_track_url(track.id), headers: auth_header
      end.to change(Like, :count).by(0)
      expect(response).to have_http_status :ok
    end
  end

  describe 'POST /listen' do
    it 'increments the tracks play_count' do
      expect do
        post listen_track_url(track.id)
      end.to change(track.plays, :count).by(1)
    end

    context 'logged in' do
      context 'track not already in recents' do
        it 'adds the track to the users recents' do
          expect do
            post listen_track_url(track.id), headers: auth_header
          end.to change(user.recents, :count).by(1)
        end
      end

      context 'track is in recents' do
        it 'does not add track to the users recents' do
          Recent.create(user: user, track: track)
          expect do
            post listen_track_url(track.id), headers: auth_header
          end.to change(user.recents, :count).by(0)
        end
      end
    end
  end

  describe 'POST /streams' do
    let(:jwt) do
      ApplicationController.new.encode_jwt({
                                             iss: 'juke',
                                             exp: (Time.now.to_i + 3600),
                                             sub: 'juke-transcoder'
                                           })
    end
    let(:jwt_header) { { "Authorization": "bearer #{jwt}" } }

    it 'requires jwt' do
      post streams_track_url(track.id)
      expect(response).to have_http_status :unauthorized
    end

    context 'error processing' do
      it 'sets processing to error' do
        post streams_track_url(track.id), headers: jwt_header,
                                          params: { status: 422 }
        expect(track.reload.processing).to eq('error')
        expect(response).to have_http_status(200)
      end
    end

    context 'successful processing' do
      let(:track) { FactoryBot.create(:track_live, owner: user, processing: 'started', peaks: nil, duration: nil) }
      let(:peaks) do
        peaks = []
        (420 * 4).times { peaks.push(Random.rand(32_000), -Random.rand(32_000)) }
        peaks
      end

      let(:params) do
        {
          status: 200,
          peaks: peaks,
          input: {
            metadata: {
              format: {
                duration: 420
              }
            }
          },
          outputs: [{ format: 'mp3' }, { format: 'webm' }]
        }
      end

      before(:each) do
        post streams_track_url(track.id),
             headers: jwt_header,
             params: params,
             as: :json
      end

      it 'sets processing as complete' do
        expect(track.reload.processing).to match('done')
      end

      it 'saves peaks as converted base64' do
        expect(track.reload.peaks).to match(%r{[a-zA-Z0-9+/]{420}})
      end

      it 'saves duration' do
        expect(track.reload.duration).to eq(420)
      end
    end
  end
end
