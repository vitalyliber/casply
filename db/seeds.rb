# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create!(
  {
    name: 'Super Girl',
    gender: :female,
    country: 'AU',
    email: 'SuperGirl@gmail.com',
    password: '111111',
  }
)

user.update!(confirmed_at: Time.now)