class AllowNullTrackTitle < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tracks, :title, :true
  end
end
