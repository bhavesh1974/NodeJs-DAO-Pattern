const mysql = require("mysql");
const config = require("./config");
const moment = require("moment");

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  dateStrings: "date"
});

connection.connect(function(error) {
  if (error) {
    logger.error("error connecting: " + error.stack);
    return;
  }
  logger.info(
    "Database connected at " + moment().format("DD-MM-YYYY hh:mm:ss:SSS A")
  );
});

module.exports = connection;
