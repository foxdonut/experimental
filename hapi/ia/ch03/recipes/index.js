"use strict";

const Async = require("crocks/Async");
const Maybe = require("crocks/Maybe");
const Result = require("crocks/Result");

const toMaybe = value => value ? Maybe.Just(value) : Maybe.Nothing();

/*
exports.findAll = function(db, query, cb) {
  let sql = "select * from recipes";
  const params = [];

  if (query.cuisine) {
    sql += " where cuisine = ?";
    params.push(query.cuisine);
  }
  db.all(sql, params, cb);
};
*/

exports.findAll = function(db, query) {
  let sql = "select * from recipes";
  const params = [];

  if (query.cuisine) {
    sql += " where cuisine = ?";
    params.push(query.cuisine);
  }
  return Async.fromNode(db.all)(sql, params);
};

/*
exports.findOne = function(db, id, cb) {
  db.get("select * from recipes where id = ?", [id], cb);
};
*/

exports.findOne = function(db, id) {
  return Async.fromNode(db.get)("select * from recipes where id = ?", [id])
    .map(toMaybe);
};

/*
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
*/

exports.create = function(db, payload) {
  const sql = "INSERT INTO recipes (name, cooking_time, prep_time, serves, cuisine, ingredients, "
    + "directions, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  return Async.fromNode(db.run)(sql, [
    payload.name,
    payload.cooking_time,
    payload.prep_time,
    payload.serves,
    payload.cuisine,
    payload.ingredients,
    payload.directions,
    auth.credentials.id
  ]);
};

/*
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
*/

exports.star = function(db, id) {
  const sqlRead = "SELECT stars FROM recipes WHERE id = ?";

  return Async.fromNode(db.get)(sqlRead, [id]).chain(row => {
    if (row) {
      const newStars = row.stars + 1;

      const sqlWrite = "UPDATE recipes SET stars = ? WHERE id = ?";

      return Async.fromNode(db.run)(sqlWrite, [newStars, id]).map(Result.Ok);
    }
    else {
      return Async.of(Result.Err());
    }
  });
};
