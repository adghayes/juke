class Session < ApplicationRecord
  validates :token, presence: true, uniqueness: true

  belongs_to :user

  def self.generate_token
    SecureRandom.base64(16)
  end

  def self.for(user, about = nil)
    if about
      self.new(user_id: user.id, token: generate_token, active: true, **about)
    else
      self.new(user_id: user.id, token: generate_token, active: true)
    end
  end

  def deactivate!
    update_attributes(active: false)
  end
end
