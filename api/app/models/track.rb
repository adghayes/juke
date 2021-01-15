# == Schema Information
#
# Table name: tracks
#
#  id           :bigint           not null, primary key
#  description  :text
#  downloadable :boolean          default(FALSE)
#  duration     :float
#  peaks        :text
#  processing   :string
#  slug         :string
#  submitted    :boolean          default(FALSE)
#  title        :string
#  uploaded     :boolean          default(FALSE)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  owner_id     :bigint           not null
#
# Indexes
#
#  index_tracks_on_created_at          (created_at)
#  index_tracks_on_owner_id_and_title  (owner_id,title) UNIQUE
#  index_tracks_on_title               (title)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#
class Track < ApplicationRecord
  extend FriendlyId
  friendly_id :title, use: :scoped, scope: :owner

  after_initialize :default_processing

  validates :description, length: { maximum: 160 }
  
  validates :title, presence: { if: :submitted }, 
    uniqueness: { scope: :owner_id, if: :submitted, message: 'You already have a track with that title' }
  
  validate :require_original, if: :downloadable
  validate :require_streams, if: :processed?
  validates :duration, presence: { if: :processed? }
  validates :peaks, presence: { if: :processed? }


  belongs_to :owner,
    class_name: :User,
    primary_key: :id,
    foreign_key: :owner_id

  has_many :likes,
    dependent: :destroy

  has_many :plays,
    dependent: :destroy

  has_one :stats,
    class_name: :TrackStats,
    foreign_key: :id,
    primary_key: :id

  has_one_attached :thumbnail
  has_one_attached :original
  has_many_attached :streams

  def should_generate_new_friendly_id?
    changed.include?('title')
  end

  def like_count
    Rails.cache.fetch("#{cache_key_with_version}/like_count", expires_in: 1.minute) do
      likes.count
    end
  end

  def listen_count
    Rails.cache.fetch("#{cache_key_with_version}/listen_count", expires_in: 1.minute) do
      histories.count
    end
  end

  def live?
    submitted && processed?
  end

  def processed?
    processing == 'done'
  end

  def self.live 
    where(submitted: true, processing: "done")
  end

  def self.with_details
    self
      .with_attached_thumbnail
      .with_attached_streams
      .with_attached_original
      .eager_load(:stats, :owner, owner: [avatar_attachment: :blob])
  end

  def listen
    Play.create(track: self)
  end

  private

  def require_original
    errors.add(:original, 'Must have an associated original audio file') unless original.attached?
  end

  def require_streams
    errors.add(:streams, 'Must have an associated file for streaming') unless streams.attached?
  end

  def default_processing
    self.processing ||= 'none'
  end
end
