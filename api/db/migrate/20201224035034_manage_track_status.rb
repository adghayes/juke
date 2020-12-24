class ManageTrackStatus < ActiveRecord::Migration[6.1]
  def change
    remove_column :tracks, :status
    add_column :tracks, :uploaded, :boolean, default: false
    add_column :tracks, :processed, :boolean, default: false
    add_column :tracks, :submitted, :boolean, default: false
  end
end
