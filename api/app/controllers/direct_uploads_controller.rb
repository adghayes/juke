class DirectUploadsController < ActiveStorage::DirectUploadsController
  include Auth
  skip_before_action :verify_authenticity_token
  before_action :require_auth
end
