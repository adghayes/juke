class FeedController < ApplicationController

  def spotlight
    @track = Track.live.last
    render 'tracks/show'
  end
end
