class AddDurationPeaksToTracks < ActiveRecord::Migration[6.1]
  def change
    add_column :tracks, :duration, :float
    add_column :tracks, :peaks, :integer, array: true
  end
end
