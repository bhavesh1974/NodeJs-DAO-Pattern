module.exports = {
  server: {
    port: process.env.PORT || 8000
  },

  database: {
    host: "localhost",
    name: "sample",
    user: "root",
    password: "admin"
  },

  JWT: {
    JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "secretkey",
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || "7d"
  }
};
