"use strict";

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "ema"
});

exports.findSome = function(request, reply) {
  let sql = "select * from ve_diagnosis limit 10";

  connection.connect();
  connection.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    return reply(rows);
  });

  connection.end();
};

