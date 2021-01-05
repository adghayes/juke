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

  validate :require_original
  validates :title, presence: { if: :submitted, message: 'Tracks need a title!' }, 
    uniqueness: { scope: :owner_id, allow_nil: true, message: 'You already have a track with that title' }
  validates :slug, presence: { if: :submitted }
  validates :duration, presence: { if: :processed? }
  validates :peaks, presence: { if: :processed? }
  validates :description, length: { maximum: 160 }

  belongs_to :owner,
    class_name: :User,
    primary_key: :id,
    foreign_key: :owner_id

  has_one_attached :thumbnail
  has_one_attached :original
  has_many_attached :streams

  def should_generate_new_friendly_id?
    changed.include?('title')
  end

  def live?
    uploaded && submitted && processed?
  end

  def processed?
    processing == 'done'
  end

  def self.live 
    where(submitted: true, processing: "done")
  end

  private

  def require_original
    errors.add(:original, 'Must have an associated audio file') unless original.attached?
  end

  def default_processing
    self.processing ||= 'none'
  end
end
