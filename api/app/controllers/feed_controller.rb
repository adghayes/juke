# frozen_string_literal: true

class FeedController < ApplicationController
  def show
    latest = params[:latest] ? DateTime.iso8601(params[:latest]) : DateTime.now
    limit = params[:limit] ? params[:limit].to_i : 5

    track_ids_with_timestamp = Track
                               .live
                               .where('created_at < ?', latest)
                               .order('created_at': :desc)
                               .limit(limit)
                               .pluck(:id, :created_at)
    track_ids, timestamps = track_ids_with_timestamp.transpose
    @tracks = track_ids ? Track.with_details.find(track_ids) : []

    @oldest = timestamps.try(:min).try(:iso8601)
    @limit = limit
    @path = feed_path

    render 'tracks/queue'
  end

  def spotlight
    @track = Track.live.last
    render 'tracks/show'
  end
end
