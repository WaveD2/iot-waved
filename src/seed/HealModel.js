const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const User = require("../Model/User");
const { faker } = require("@faker-js/faker");
const { HealthModel, TemperatureModel } = require("../Model/Health");

async function generateFakeData() {
    const userId = await User.findOne({ email: "a@gmail.com" }).select("id").lean();
    console.log("userId", userId);
    
    const healthData = [];
    for (let i = 0; i < 50; i++) {
        healthData.push({
            userId,
            heartRate: faker.number.int({ min: 60, max: 120 }),
        });
    }

    const temperatureData = [];
    for (let i = 0; i < 50; i++) {
        temperatureData.push({
            userId,
            temperature: faker.number.float({ min: 36.0, max: 39.5, precision: 0.1 }),
        });
    }

    await HealthModel.insertMany(healthData);
    await TemperatureModel.insertMany(temperatureData);

    console.log('✅ Fake data inserted successfully');
}

generateFakeData().catch(console.error);


module.exports = { generateFakeData };  