class MakeTrackTitleIndexPartial < ActiveRecord::Migration[6.1]
  def change
    remove_index :tracks,  [:owner_id, :title]
    add_index :tracks, [:owner_id, :title], unique: true, where: "submitted"
    add_index :tracks, [:owner_id, :slug], unique: true, where: "submitted"
  end
end
