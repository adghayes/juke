class ChangePeaksType < ActiveRecord::Migration[6.1]
  def change
    remove_column :tracks, :peaks, :int
    add_column :tracks, :peaks, :text
  end
end
