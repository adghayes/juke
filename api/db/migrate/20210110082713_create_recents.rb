class CreateRecents < ActiveRecord::Migration[6.1]
  def change
    create_table :recents do |t|
      t.references :track, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.datetime :created_at, null: false
    end

    add_index :recents, [:user_id, :track_id], unique: true
  end
end
