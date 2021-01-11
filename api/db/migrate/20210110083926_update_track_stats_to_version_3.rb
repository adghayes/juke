class UpdateTrackStatsToVersion3 < ActiveRecord::Migration[6.1]
  def change
    update_view :track_stats, version: 3, revert_to_version: 2
  end
end
