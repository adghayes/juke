class AddStatusToTracks < ActiveRecord::Migration[6.1]
  def change
      add_column :tracks, :status, :string, null: false  
  end
end
