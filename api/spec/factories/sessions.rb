FactoryBot.define do
  factory :session do
    token { "MyString" }
    user { "" }
    active { false }
    device { "MyString" }
    browser { "MyString" }
    location { "MyString" }
  end
end
