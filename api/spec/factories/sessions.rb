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
