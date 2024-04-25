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
    "port_no": process.env.PORT
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT??3306,
    "dialect": process.env.DIALECT,
    "port_no": process.env.PORT
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "db_port": process.env.DB_PORT??3306,
    "dialect": process.env.DIALECT,
    "port_no": process.env.PORT
  }
}

module.exports = config[env];
