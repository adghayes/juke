class DropHistories < ActiveRecord::Migration[6.1]
  def change
    drop_table :histories
  end
end
