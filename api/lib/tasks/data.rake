# frozen_string_literal: true

namespace :data do
  desc 'This task clears active storage and database and reseeds'
  task :reset, [:seed_type] => [:environment] do |_task, args|
    Track.destroy_all
    User.destroy_all
    ActiveStorage::Blob.destroy_all
    Rake::Task['db:truncate_all'].invoke
    load File.join(Rails.root, 'db', 'seeds', "#{args[:seed_type]}_seeds.rb")
  end
end
