const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());

const { connection } = require("./Config/config");
const GithubController = require("./Controllers/Github.controller");

app.use("/user", GithubController);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connection established");
  } catch (err) {
    console.log(err);
  }
  console.log("server listening on port " + process.env.PORT);
});
