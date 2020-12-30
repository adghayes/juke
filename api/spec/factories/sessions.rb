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
FactoryBot.define do
  factory :session do
    token { "MyString" }
    user { "" }
    active { false }
    device { "MyString" }
    browser { "MyString" }
    location { "MyString" }
  end
end
