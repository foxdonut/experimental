"use strict";

exports.findAll = function(request, reply) {
  let sql = "select * from recipes";
  const params = [];

  if (request.query.cuisine) {
    sql += " where cuisine = ?";
    params.push(request.query.cuisine);
  }
  this.db.all(sql, params, (err, rows) => {
    if (err) {
      throw err;
    }
    return reply(rows);
  });
};

exports.findOne = function(request, reply) {
  this.db.get("select * from recipes where id = ?", [request.params.id], (err, row) => {
    if (err) {
      throw err;
    }
    if (row) {
      return reply(row);
    }
    return reply("Recipe not found").code(404);
  });
};

