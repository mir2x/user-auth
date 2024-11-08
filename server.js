const express = require("express");
require("dotenv").config();
const connectDB = require("./app/connection/connectDB");
const AuthRoutes = require("./app/module/auth/auth.routes");

const app = express();
app.use(express.json());

const startServer = async () => {
  await connectDB();

  app.use("/auth", AuthRoutes);

  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
};
startServer();
