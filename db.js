"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");
const secret = require('./secret')

let db;

if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: `postgresql://postgres:${secret}@localhost/${getDatabaseUri()}`,
    ssl: {
      rejectUnauthorized: false
    },
  });
} else {
  db = new Client({
    connectionString: `postgresql://postgres:${secret}@localhost/${getDatabaseUri()}`,
    ssl: false
  });
}

db.connect();

module.exports = db;