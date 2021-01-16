# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(%r{http://lvh\.me(:\d+)?}, %r{https://.*\.vercel\.app})

    resource '*',
             headers: %w[accept accept-encoding authorization cache-control connection host origin pragma referer sec-fetch-dest sec-fetch-mode sec-fetch-site user-agent x-requested-with],
             methods: %i[get post put patch delete options head],
             credentials: true,
             max_age: 24 * 3600
  end
end

Rails.application.config.action_controller.forgery_protection_origin_check = false
