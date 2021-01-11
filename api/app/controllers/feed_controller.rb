class FeedController < ApplicationController
  def show
    sleep 1
    latest = params[:latest] ? DateTime.iso8601(params[:latest]) : DateTime.now.iso8601
    @limit = params[:limit] ? params[:limit].to_i : 5

    track_ids = Track
      .live
      .where('tracks.created_at < ?', latest )
      .order('tracks.created_at': :desc)
      .limit(@limit)
      .pluck(:id)

    @tracks = Track
      .with_details
      .find(track_ids)
      
    render :show
  end

  def spotlight
    @track = Track.live.last
    render 'tracks/show'
  end
end
