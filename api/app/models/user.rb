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
  validates :email, presence: { message: "Can't be empty"}, uniqueness: { message: "That's already taken"},
    format: { with: URI::MailTo::EMAIL_REGEXP, message: "Invalid email address" }
  validates :display_name, presence: { message: "Can't be blank"}, uniqueness: { message: "That's already taken"},
    length: { minimum: 3, message: "Minimum length: 3" }
  validates :password_digest, presence: { message: "Can't be blank" }
  validates :password, length: { minimum: 8, allow_nil: true , message: "Minimum length: 8"}

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
