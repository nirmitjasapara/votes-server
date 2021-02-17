require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const errorHandler = require("./error-handler");
const authRouter = require("./auth/auth-router");
const pollsRouter = require("./polls/polls-router");
const votingRouter = require("./voting/voting-router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test"
  })
);
app.use(cors());
app.use(helmet());
app.use("/api/auth", authRouter);
app.use("/api/polls", pollsRouter);
app.use("/api/vote", votingRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(errorHandler);

module.exports = app;
