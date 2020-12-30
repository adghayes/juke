class ChangeProcessedToString < ActiveRecord::Migration[6.1]
  def change
    remove_column :tracks, :processed, :boolean
    add_column :tracks, :playback_status, :string
  end
end
