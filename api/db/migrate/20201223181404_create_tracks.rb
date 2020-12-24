class CreateTracks < ActiveRecord::Migration[6.1]
  def change
    create_table :tracks do |t|
      t.string :title, null: false
      t.text :description
      t.boolean :downloadable, default: false
      t.references :owner, null: false, index: true, foreign_key: {to_table: :users} 

      t.timestamps
    end
  end
end
