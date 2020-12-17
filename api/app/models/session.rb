class Session < ApplicationRecord
  belongs_to :user

  def deactivate!
    update_attributes(active: false)
  end
end
