# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_15_060003) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.string "service_name", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "track_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.index ["created_at"], name: "index_likes_on_created_at"
    t.index ["track_id"], name: "index_likes_on_track_id"
    t.index ["user_id", "track_id"], name: "index_likes_on_user_id_and_track_id", unique: true
  end

  create_table "plays", force: :cascade do |t|
    t.bigint "track_id", null: false
    t.datetime "created_at", null: false
    t.index ["track_id"], name: "index_plays_on_track_id"
  end

  create_table "recents", force: :cascade do |t|
    t.bigint "track_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.index ["track_id"], name: "index_recents_on_track_id"
    t.index ["user_id", "track_id"], name: "index_recents_on_user_id_and_track_id", unique: true
    t.index ["user_id"], name: "index_recents_on_user_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.string "token", null: false
    t.bigint "user_id", null: false
    t.boolean "active", default: true, null: false
    t.string "device"
    t.string "browser"
    t.string "location"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["token"], name: "index_sessions_on_token", unique: true
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "tracks", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.boolean "downloadable", default: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "slug"
    t.boolean "uploaded", default: false
    t.boolean "submitted", default: false
    t.float "duration"
    t.string "processing"
    t.text "peaks"
    t.index ["created_at"], name: "index_tracks_on_created_at"
    t.index ["owner_id", "slug"], name: "index_tracks_on_owner_id_and_slug", unique: true, where: "submitted"
    t.index ["owner_id", "title"], name: "index_tracks_on_owner_id_and_title", unique: true, where: "submitted"
    t.index ["title"], name: "index_tracks_on_title"
  end

  create_table "users", force: :cascade do |t|
    t.citext "email", null: false
    t.string "display_name", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "bio"
    t.string "slug"
    t.index ["display_name"], name: "index_users_on_display_name", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "likes", "tracks"
  add_foreign_key "likes", "users"
  add_foreign_key "plays", "tracks"
  add_foreign_key "recents", "tracks"
  add_foreign_key "recents", "users"
  add_foreign_key "sessions", "users"
  add_foreign_key "tracks", "users", column: "owner_id"

  create_view "track_stats", sql_definition: <<-SQL
      SELECT tracks.id,
      count(DISTINCT likes.id) AS likes_count,
      count(DISTINCT plays.id) AS play_count
     FROM ((tracks
       LEFT JOIN likes ON ((tracks.id = likes.track_id)))
       LEFT JOIN plays ON ((tracks.id = plays.track_id)))
    GROUP BY tracks.id;
  SQL
end
