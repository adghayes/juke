class AddCreatedAtIndices < ActiveRecord::Migration[6.1]
  def change
    add_index :histories, :created_at
    add_index :likes, :created_at
    add_index :tracks, :created_at
  end
end
