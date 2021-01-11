# == Schema Information
#
# Table name: track_stats
#
#  id          :bigint           primary key
#  likes_count :bigint
#  play_count  :bigint
#
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
