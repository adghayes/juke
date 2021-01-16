# frozen_string_literal: true

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
class Session < ApplicationRecord
  validates :token, presence: true, uniqueness: true

  belongs_to :user

  def self.generate_token
    SecureRandom.base64(24)
  end

  def self.for(user, about = {})
    create!(user: user, token: generate_token, active: true, **about)
  rescue ActiveRecord::RecordNotUnique
    retry
  end

  def deactivate!
    update(active: false)
  end
end
