# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :citext           not null
#  display_name    :string           not null
#  password_digest :string           not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
class User < ApplicationRecord
  validates :email, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :display_name, presence: true, uniqueness: true,
    length: { minimum: 3 }
  validates :password_digest, presence: { message: "Password can't be blank" }
  validates :password, length: { minimum: 8, allow_nil: true }

  attr_reader :password

  has_many :sessions,
    dependent: :destroy
    
  has_one_attached :avatar

  def self.find_by_credentials(email, password)
    email_match = self.find_by(email: email)
    return nil unless email_match

    email_match.is_password?(password) ? email_match : nil
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end
end
