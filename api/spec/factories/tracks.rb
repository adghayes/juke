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
#  index_tracks_on_owner_id_and_title  (owner_id,title) UNIQUE
#  index_tracks_on_title               (title)
#
# Foreign Keys
#
#  fk_rails_...  (owner_id => users.id)
#

FactoryBot.define do
  factory :track do
    owner { association :user }
    title { Faker::Lorem.unique.word }
    submitted { true }
    
    factory :track_live do
      transient do
        original { File.join(Rails.root, 'spec', 'attachments', 'cantina.mp3') }
        streams { original }
        basename { original ? File.basename(original) : nil }
        metadata { original ? AudioInfo.open(original) { |info| info.to_h } : nil }
      end

      duration { metadata && metadata["length"] || 150  } 
      peaks { Random.base64(432) }
      uploaded { true }
      processing { 'done' }

      after(:build) do |track, evaluator|
        if evaluator.original
          track.original.attach(io: File.open(evaluator.original), filename: evaluator.basename, 
            content_type: MIME::Types.type_for(evaluator.basename)[0].to_s)
          track.streams.attach(io: File.open(evaluator.original), filename: evaluator.basename, 
            content_type: MIME::Types.type_for(evaluator.basename)[0].to_s)
        end

        if evaluator.thumbnail
          track.thumbnail.attach(io: File.open(evaluator.thumbnail), filename: File.basename(evaluator.thumbnail), 
            content_type: MIME::Types.type_for(evaluator.thumbnail)[0].to_s)
        end
      end
    end
  end
end

