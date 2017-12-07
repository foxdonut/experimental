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

exports.create = function(request, reply) {
  const sql = "INSERT INTO recipes (name, cooking_time, prep_time, serves, cuisine, ingredients, "
    + "directions, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  this.db.run(sql, [
    request.payload.name,
    request.payload.cooking_time,
    request.payload.prep_time,
    request.payload.serves,
    request.payload.cuisine,
    request.payload.ingredients,
    request.payload.directions,
    request.auth.credentials.id
  ], err => {
    if (err) {
      throw err;
    }
    reply({ status: "OK" });
  });
};

exports.star = function(request, reply) {
  const id = request.params.id;
  const sqlRead = "SELECT stars FROM recipes WHERE id = ?";

  this.db.get(sqlRead, [id], (err, row) => {
    if (err) {
      throw err;
    }

    if (row) {
      const newStars = row.stars + 1;

      const sqlWrite = "UPDATE recipes SET stars = ? WHERE id = ?";

      this.db.run(sqlWrite, [newStars, id], err => {
        if (err) {
          throw err;
        }
        return reply({ status: "OK" });
      });
    }
    else {
      return reply("Recipe not found").code(404);
    }
  });
};
