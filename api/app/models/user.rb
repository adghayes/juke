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
#  bio             :text
#  slug            :string
#
# Indexes
#
#  index_users_on_display_name  (display_name) UNIQUE
#  index_users_on_email         (email) UNIQUE
#
class User < ApplicationRecord
  extend FriendlyId
  friendly_id :display_name, :use => :slugged

  validates :email, uniqueness: { message: "That's already taken", case_sensitive: false },
    format: { with: URI::MailTo::EMAIL_REGEXP, message: "Invalid email address" }
  validates :display_name, uniqueness: { message: "That's already taken"},
    length: { minimum: 3, maximum: 24 }
  validates :password_digest, presence: true
  validates :password, length: { minimum: 8, allow_nil: true }
  validates :bio, length: { maximum: 160 }

  attr_reader :password

  has_many :sessions,
    dependent: :destroy

  has_many :tracks,
    primary_key: :id,
    foreign_key: :owner_id,
    dependent: :destroy

  has_many :likes,
    dependent: :destroy

  has_many :recents,
    dependent: :destroy

  has_many :liked_tracks,
    through: :likes,
    source: :track

  has_many :recent_tracks,
    through: :recents,
    source: :track
    
  has_one_attached :avatar

  def self.find_by_credentials(email, password)
    email_match = self.find_by(email: email)
    return nil unless email_match

    email_match.is_password?(password) ? email_match : nil
  end

  def self.with_details
    self
      .includes(:tracks, :likes, :recents)
      .with_attached_avatar
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(password_digest).is_password?(password)
  end

  def listen(track)
    Recent.transaction do
      recent = Recent.find_or_create_by(user: self, track: track)
      if recent.persisted? && recents.count > Recent::LENGTH
        recents.order(:created_at).first.delete
      end
    end
  end
end
