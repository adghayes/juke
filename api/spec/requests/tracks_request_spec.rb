require 'rails_helper'

RSpec.describe "Tracks", type: :request do
  let(:user) { FactoryBot.create(:user) }
  let(:session) { Session.for(user) }

  let(:valid_headers) { { "Authorization": "bearer #{session.token}"}}
  let(:valid_attributes) { { password: "password", email: user.email } }

  let(:invalid_attributes) { { password: "wrong_password", email: user.email } }

  describe "POST /create" do
    context "logged in" do
      it "creates a new Session" do
        expect {
          post session_url, as: :json
        }.to change(Session, :count).by(1)
      end

      it "renders a JSON response with the new session" do
        post session_url,
             params: { user: valid_attributes }, as: :json
        expect(response).to have_http_status(:created)
      end
    end

    context "not logged in" do
      it "does not create a new Session" do
        expect {
          post session_url,
               params: { user: invalid_attributes }, as: :json
        }.to change(Session, :count).by(0)
      end

      it "renders a JSON response with errors for the new session" do
        post session_url,
             params: { user: invalid_attributes }, as: :json
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
