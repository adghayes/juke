# == Schema Information
#
# Table name: sessions
#
#  id         :bigint           not null, primary key
#  token      :string           not null
#  user_id    :bigint           not null
#  active     :boolean          default(TRUE), not null
#  device     :string
#  browser    :string
#  location   :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_sessions_on_token    (token) UNIQUE
#  index_sessions_on_user_id  (user_id)
#
require 'rails_helper'

RSpec.describe Session, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
