class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'citext'

    create_table :users do |t|
      t.citext :email, null: false, index: {unique: true}
      t.string :display_name, null: false, index: {unique: true}
      t.string :password_digest, null: false

      t.timestamps
    end
  end
end
