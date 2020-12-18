class CreateSessions < ActiveRecord::Migration[6.0]
  def change
    create_table :sessions do |t|
      t.string :token, null: false, index: { unique: true }
      t.references :user, null: false, foreign_key: true, index: true
      t.boolean :active, default: true, null: false

      t.string :device
      t.string :browser
      t.string :location

      t.timestamps
    end
  end
end
