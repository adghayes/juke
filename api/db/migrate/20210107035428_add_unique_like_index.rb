class AddUniqueLikeIndex < ActiveRecord::Migration[6.1]
  def change
    remove_index :likes, :user_id
    add_index :likes, [:user_id, :track_id], unique: true
  end
end
