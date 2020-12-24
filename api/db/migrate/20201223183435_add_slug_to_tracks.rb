class AddSlugToTracks < ActiveRecord::Migration[6.1]
  def change
    add_column :tracks, :slug, :string, index: true
    remove_index :tracks, :owner_id
    add_index :tracks, :title
    add_index :tracks, [:owner_id, :title], unique: true
  end
end
