# frozen_string_literal: true

require 'rails_helper'

RSpec.describe '/sessions', type: :request do
  let(:user) { FactoryBot.create(:user, password: 'password') }

  let(:valid_attributes) { { password: 'password', email: user.email } }
  let(:invalid_attributes) { { password: 'wrong_password', email: user.email } }

  describe 'POST /create' do
    context 'with valid parameters' do
      it 'creates a new Session' do
        expect do
          post session_url,
               params: { user: valid_attributes }, as: :json
        end.to change(Session, :count).by(1)
      end

      it 'renders a JSON response with the new session' do
        post session_url,
             params: { user: valid_attributes }, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      it 'does not create a new Session' do
        expect do
          post session_url,
               params: { user: invalid_attributes }, as: :json
        end.to change(Session, :count).by(0)
      end

      it 'renders a JSON response with errors for the new session' do
        post session_url,
             params: { user: invalid_attributes }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE /destroy' do
    it 'deactivates the requested session' do
      user = FactoryBot.create(:user)
      session = Session.for(user)
      delete session_url, headers: { 'Authorization' => "bearer #{session.token}" }
      expect(session.reload.active).to be false
    end
  end
end
