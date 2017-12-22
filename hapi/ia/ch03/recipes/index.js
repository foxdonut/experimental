"use strict";

exports.findAll = function(db, query, cb) {
  let sql = "select * from recipes";
  const params = [];

  if (query.cuisine) {
    sql += " where cuisine = ?";
    params.push(query.cuisine);
  }
  db.all(sql, params, cb);
};

exports.findOne = function(db, id, cb) {
  db.get("select * from recipes where id = ?", [id], cb);
};

exports.create = function(db, payload, cb) {
  const sql = "INSERT INTO recipes (name, cooking_time, prep_time, serves, cuisine, ingredients, "
    + "directions, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.run(sql, [
    payload.name,
    payload.cooking_time,
    payload.prep_time,
    payload.serves,
    payload.cuisine,
    payload.ingredients,
    payload.directions,
    auth.credentials.id
  ], cb);
};

exports.star = function(db, id, cb) {
  const sqlRead = "SELECT stars FROM recipes WHERE id = ?";

  db.get(sqlRead, [id], (err, row) => {
    if (!err && row) {
      const newStars = row.stars + 1;

      const sqlWrite = "UPDATE recipes SET stars = ? WHERE id = ?";

      db.run(sqlWrite, [newStars, id], err => {
        cb(err, row);
      });
    }
    else {
      cb(err, row);
    }
  });
};
