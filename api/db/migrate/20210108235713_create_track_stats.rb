class CreateTrackStats < ActiveRecord::Migration[6.1]
  def change
    create_view :track_stats
  end
end
