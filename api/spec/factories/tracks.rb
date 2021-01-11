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
    transient do 
      file { true }
      basename {  File.basename(file) }
      thumbnail { true }
      metadata { AudioInfo.open(file) { |info| info.to_h } }
    end

    title { basename } 
    duration { metadata["length"] } 
    downloadable { Random.rand > 0.8 }
    description { Random.rand > 0.5 ? Faker::Lorem.sentence  : '' }
    peaks { Random.base64(432) }
    uploaded { true }
    submitted { true }
    processing { 'done' }
    owner { User.all[Random.rand(User.count)] }
    created_at { Faker::Time.backward(days: 14) }

    after(:build) do |track, evaluator|
      track.original.attach(io: File.open(evaluator.file), filename: evaluator.basename, 
        content_type: MIME::Types.type_for(evaluator.basename)[0].to_s)
      track.streams.attach(io: File.open(evaluator.file), filename: evaluator.basename, 
        content_type: MIME::Types.type_for(evaluator.basename)[0].to_s)
      track.thumbnail.attach(io: File.open(evaluator.thumbnail), filename: File.basename(evaluator.thumbnail), 
        content_type: MIME::Types.type_for(evaluator.thumbnail)[0].to_s)
    end
  end
end

