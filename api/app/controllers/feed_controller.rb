class FeedController < ApplicationController
  def show
    latest = params[:latest] ? DateTime.iso8601(params[:latest]) : DateTime.now.iso8601
    @limit = params[:limit] || 5
    
    @track_ids = Track.live
      .where('tracks.created_at < ?', latest )
      .order('tracks.created_at': :desc)
      .limit(@limit)
      .pluck(:id)

    @tracks = Track
      .with_attached_thumbnail
      .with_attached_streams
      .with_attached_original
      .includes(:stats, :owner)
      .eager_load(owner: [:avatar_attachment])
      .find(@track_ids)
      
    render :show
  end

  def spotlight
    @track = Track.live.last
    render 'tracks/show'
  end
end
