class CreatePlays < ActiveRecord::Migration[6.1]
  def change
    create_table :plays do |t|
      t.references :track, null: false, foreign_key: true, index: true

      t.datetime :created_at, null: false
    end
  end
end
