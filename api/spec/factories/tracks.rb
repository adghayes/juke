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

music_dir = File.join(Rails.root, 'spec', 'attachments', 'music')

FactoryBot.define do
  factory :track do
    transient do 
      filename { true }
      path { File.join(music_dir, filename) }
      metadata { AudioInfo.open(path) { |info| info.to_h } }
      num_likes { 3 }
      num_listens { 10 }
    end

    title { metadata.title.presence || File.basename(filename, ".*").split('-').map(&:capitalize).join(' ') } 
    duration { metadata["length"] } 
    downloadable { Random.rand > 0.5 }
    description { Random.rand > 0.5 ? Faker::Lorem.sentence  : '' }
    peaks { Random.base64(432) }
    uploaded { true }
    submitted { true }
    processing { 'done' }
    owner { User.all[Random.rand(User.count)] }
    created_at { Faker::Time.backward(days: 14) }

    after(:build) do |track, evaluator|
      track.original.attach(io: File.open(evaluator.path), filename: evaluator.filename, 
        content_type: MIME::Types.type_for(evaluator.filename)[0].to_s)
      track.streams.attach(io: File.open(evaluator.path), filename: evaluator.filename, 
        content_type: MIME::Types.type_for(evaluator.filename)[0].to_s)
    end
  end
end

