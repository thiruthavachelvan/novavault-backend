require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function testDB() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected Successfully.");
        
        console.log("Looking up user...");
        const user = await User.findOne({ email: "thirukumar3210@gmail.com" });
        console.log("User lookup complete:");
        console.log(user);
        
        process.exit(0);
    } catch (err) {
        console.error("DB Error:", err);
        process.exit(1);
    }
}

testDB();
