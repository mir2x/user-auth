const mongoose = require("mongoose");
const to = require("await-to-js").default;

const connectDB = async () => {
  const [error] = await to(mongoose.connect(process.env.MONGO_URI));
  if (error) throw new Error(`DB connection failed : ${error.message}`);
  console.log("Successfully connect to DB");
};

module.exports = connectDB;
