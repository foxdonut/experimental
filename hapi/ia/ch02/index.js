"use strict";

const Hapi = require("hapi");
const Sqlite3 = require("sqlite3");
const AuthBearer = require("hapi-auth-bearer-token");
const routes = require("./routes");

const db = new Sqlite3.Database("./dindin.sqlite");

const server = new Hapi.Server();
server.connection({ host: "localhost", port: 4200 });

server.bind({ db });

const validationFn = function(token, callback) {
  db.get("select * from users where token = ?", [token], (err, result) => {
    if (err) {
      return callback(err, false); // error occurred with the query, do not auth user
    }

    const user = result;

    if (!user) {
      return callback(null, false); // no user found, do not auth user
    }

    // auth user and set credentials
    callback(null, true, {
      id: user.id,
      username: user.username
    });
  });
}

server.register(AuthBearer, err => {
  if (err) {
    throw err;
  }
  server.auth.strategy("api", "bearer-access-token", {
    validateFunc: validationFn
  })
  server.route(routes);
  server.start(() => console.log("Server running on", server.info.uri));
});

