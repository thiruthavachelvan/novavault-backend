const mongoose = require("mongoose");
require("dotenv").config();

console.log("Attempting quick connection timeout test...");

mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection Failed. This confirms the DB is unreachable from this IP.");
    console.error(err.message);
    process.exit(1);
  });
