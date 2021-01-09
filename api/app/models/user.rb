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

  validates :email, presence: { message: "Can't be empty"}, uniqueness: { message: "That's already taken"},
    format: { with: URI::MailTo::EMAIL_REGEXP, message: "Invalid email address" }
  validates :display_name, presence: { message: "Can't be blank"}, uniqueness: { message: "That's already taken"},
    length: { minimum: 3, message: "Minimum length: 3" }
  validates :password_digest, presence: { message: "Can't be blank" }
  validates :password, length: { minimum: 8, allow_nil: true , message: "Minimum length: 8"}
  validates :slug, presence: true
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

  has_many :histories,
    dependent: :destroy

  has_many :liked_tracks,
    through: :likes,
    source: :track

  has_many :listened_tracks,
    through: :histories,
    source: :track
    
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

  def last_listened?(track_id)
    histories.order(created_at: :desc).limit(1).pluck(:track_id)[0] == track_id
  end

  def history_track_ids(n)
    histories.order(created_at: :desc).pluck(:track_id).uniq.slice(0, n)
  end

  def history_tracks(n)
    Track.where(id: histories.order(created_at: :desc).pluck(:track_id).uniq.slice(0, 10)).includes(:thumbnail_attachment, :streams_attachments)
  end
end
