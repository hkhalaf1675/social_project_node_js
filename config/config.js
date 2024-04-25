require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT??3306,
    "dialect": process.env.DIALECT,
    "port_no": process.env.PORT || 8080,
    "jwt_secret_key": process.env.JWT_SECRET_KEY,
    "jwt_expiration_time": process.env.JWT_EXPIRATION_TIME
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT??3306,
    "dialect": process.env.DIALECT,
    "port_no": process.env.PORT || 8080,
    "jwt_secret_key": process.env.JWT_SECRET_KEY,
    "jwt_expiration_time": process.env.JWT_EXPIRATION_TIME
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT??3306,
    "dialect": process.env.DIALECT,
    "port_no": process.env.PORT || 8080,
    "jwt_secret_key": process.env.JWT_SECRET_KEY,
    "jwt_expiration_time": process.env.JWT_EXPIRATION_TIME
  }
}

module.exports = config[env];
