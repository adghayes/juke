# == Schema Information
#
# Table name: tracks
#
#  id           :bigint           not null, primary key
#  description  :text
#  downloadable :boolean          default(FALSE)
#  duration     :float
#  peaks        :text
#  processing   :string
#  slug         :string
#  submitted    :boolean          default(FALSE)
#  title        :string
#  uploaded     :boolean          default(FALSE)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  owner_id     :bigint           not null
#
# Indexes
#
#  index_tracks_on_created_at          (created_at)
#  index_tracks_on_owner_id_and_slug   (owner_id,slug) UNIQUE WHERE submitted
#  index_tracks_on_owner_id_and_title  (owner_id,title) UNIQUE WHERE submitted
#  index_tracks_on_title               (title)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#

audio_path = File.join(Rails.root, "spec", "attachments", "cantina.mp3")

FactoryBot.define do
  factory :track do
    owner { association :user }
    title { Faker::Lorem.unique.word }
    submitted { true }
    
    factory :track_live do
      transient do
        original { nil}
        original_name { nil }
        streams { [File.open(audio_path)] }
        thumbnail { nil } 
        metadata do 
          src = original || streams[0]

          src ? AudioInfo.open(src.path) { |info| info.to_h } : nil
        end
      end

      duration { metadata && metadata["length"] || 150  } 
      peaks { Random.base64(432) }
      uploaded { true }
      processing { 'done' }

      after(:build) do |track, evaluator|
        if evaluator.original
          original = evaluator.original
          original_name = evaluator.original_name || File.basename(original.path)
          track.original.attach(io: original, filename: original_name, 
            content_type: MIME::Types.type_for(original_name)[0].to_s)
        end

        if evaluator.streams.length > 0
          evaluator.streams.each_with_index do |stream, i|
            stream_name = File.basename(stream.path)
            track.streams.attach(io: stream, filename: stream_name, 
            content_type: MIME::Types.type_for(stream_name)[0].to_s)
          end
        end

        if evaluator.thumbnail
          thumbnail = evaluator.thumbnail
          thumbnail_name = File.basename(thumbnail.path)
          track.thumbnail.attach(io: thumbnail, filename: thumbnail_name, 
            content_type: MIME::Types.type_for(thumbnail.path)[0].to_s)
        end
      end
    end
  end
end

