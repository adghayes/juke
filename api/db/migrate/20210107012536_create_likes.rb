class CreateLikes < ActiveRecord::Migration[6.1]
  def change
    drop_table :likes 
    
    create_table :likes do |t|
      t.references :track, null: false, foreign_key: true, index: true
      t.references :user, null: false, foreign_key: true, index: true

      t.datetime :created_at, null: false
    end
  end
end
