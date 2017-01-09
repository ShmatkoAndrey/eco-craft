User.create email:'shmatuan@gmail.com', password: '111111', password_confirmation: '111111'

PlantType.create name: 'Manual', per_sleep: 0, per_work: 0, light_start: 0, light_end: 0
PlantType.create name: 'Кресс салат', per_sleep: 1200, per_work: 10, light_start: 6, light_end: 20
PlantType.create name: 'Помидор', per_sleep: 900, per_work: 15, light_start: 6, light_end: 20
PlantType.create name: 'Розмарин', per_sleep: 2400, per_work: 10, light_start: 6, light_end: 20

Device.create name: 'MyFirstDevice', user_id: 1, key_device: '6689305197', light: true

Plant.create device_id: 1, per_sleep: 1200, per_work: 10, light_start: 6, light_end: 20, plant_type_id: 2