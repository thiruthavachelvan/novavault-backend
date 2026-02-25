const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 THIS PART IS IMPORTANT
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});