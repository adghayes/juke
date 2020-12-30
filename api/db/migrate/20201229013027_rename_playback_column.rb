class RenamePlaybackColumn < ActiveRecord::Migration[6.1]
  def change
    remove_column :tracks, :playback_status, :string
    add_column :tracks, :processing, :string
  end
end
