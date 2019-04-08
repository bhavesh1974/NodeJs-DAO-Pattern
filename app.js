//Import required modules
const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const config = require("./config/config");
const employeeRoute = require("./routes/employee");
const db = require("./config/db");
logger = require("./shared/services/logger");

//Apply middleware to Express
app.use(
  bodyParser.json({
    limit: 5242880
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());
app.use(helmet());

// Routing
app.use("/employee", employeeRoute);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  const statusCode = error.status || 400;
  res.status(statusCode).json({
    code: statusCode,
    message: error.message
  });
});

app.use((error, req, res, next) => {
  logger.error("System Error:", error);
  const statusCode = error.status || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: error.message
  });
});

//Handle exception and send an email to admin to alert
process.on("uncaughtException", function(error) {
  const exception_msg = error.message;
  const exception_stack = error.stack;
  logger.error("System Error:", error);
  const data = {
    err_msg: exception_msg,
    err_stack: exception_stack
  };
});

//Create HTTP server
const server = http.createServer(app);
//Start listening request on port
server.listen(config.server.port, function(error) {
  logger.info(
    `Started server on ${config.server.port} at ${moment().format(
      "DD-MM-YYYY hh:mm:ss:SSS A"
    )}`
  );
});
