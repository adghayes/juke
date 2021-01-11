class FeedController < ApplicationController
  def show
    sleep 1
    latest = params[:latest] ? DateTime.iso8601(params[:latest]) : DateTime.now.iso8601
    limit = params[:limit] ? params[:limit].to_i : 5

    track_ids_with_timestamp = Track
      .live
      .where('created_at < ?', latest )
      .order('created_at': :desc)
      .limit(limit)
      .pluck(:id, :created_at)

    track_ids, track_timestamp = track_ids_with_timestamp.transpose

    @tracks = Track
      .with_details
      .find(track_ids)

    @oldest = track_timestamp.min.iso8601
    @limit = limit
    @path = feed_path
      
    render 'tracks/queue'
  end

  def spotlight
    @track = Track.live.last
    render 'tracks/show'
  end
end
