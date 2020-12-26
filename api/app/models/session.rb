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
class Session < ApplicationRecord
  validates :token, presence: true

  belongs_to :user

  def self.generate_token
    SecureRandom.base64(24)
  end

  def self.for(user, about = {})
    begin
      self.create!(user: user, token: generate_token, active: true, **about)
    rescue ActiveRecord::RecordNotUnique
      retry
    end
  end

  def deactivate!
    update(active: false)
  end
end
