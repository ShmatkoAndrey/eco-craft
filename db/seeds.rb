User.create email:'shmatuan@gmail.com', password: '111111', password_confirmation: '111111'

#10.times { Device.create(name: Faker::Internet.user_name, user_id: 1, type_name: 'home_edition') }

Device.create name: 'MyFirstDevice', user_id: 1

Plant.create device_id: 1, humidity: 0, temperature: 0