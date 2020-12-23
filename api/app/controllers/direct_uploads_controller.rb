

class DirectUploadsController < ActiveStorage::DirectUploadsController
  include Auth
  before_action :require_logged_in
  skip_before_action :verify_authenticity_token
  
end
