
class TrackStats < ApplicationRecord
  self.primary_key = :id

  belongs_to :track,
    class_name: :Track,
    foreign_key: :id,
    primary_key: :id

  def readonly?
    true
  end
end