# frozen_string_literal: true

json.id track.id
json.title track.title
json.slug track.slug

json.owner do
  json.display_name track.owner.display_name
  json.id track.owner.id
  json.slug track.owner.slug
  json.avatar url_for(track.owner.resized_avatar) if track.owner.avatar.attached?
end

json.thumbnail url_for(track.resized_thumbnail) if track.thumbnail.attached?

json.src track.streams.map { |stream| url_for(stream) } if track.streams.attached?

json.description track.description
json.peaks track.peaks
json.duration track.duration

if current_user == track.owner
  json.live track.live?
  json.processing track.processing
  json.uploaded track.uploaded
  json.submitted track.submitted
end

json.download rails_blob_url(track.original, disposition: 'attachment') if track.downloadable

json.num_likes track.stats.likes_count
json.num_plays track.stats.play_count

json.created track.created_at
