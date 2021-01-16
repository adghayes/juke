# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Feeds', type: :request do
  describe 'GET /feed' do
    before(:all) { FactoryBot.create_list(:track_live, 10) }

    it 'returns requested number of tracks and link for next' do
      @tracks = FactoryBot.create_list(:track_live, 10)
      get "/feed?limit=7"
      body = JSON.parse(response.body)
      
      expect(response).to have_http_status(:ok)
      expect(body.tracks.length).to eq(7)
      expect(body.next).to be_truthy
    end
  end
end
