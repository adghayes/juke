class CreateHistories < ActiveRecord::Migration[6.1]
  def change
    drop_table :listens

    create_table :histories do |t|
      t.references :track, null: false, foreign_key: true, index: true
      t.references :user, null: false, foreign_key: true, index: true

      t.timestamps
    end
  end
end
