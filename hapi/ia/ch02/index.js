"use strict";

const Hapi = require("hapi");
const Sqlite3 = require("sqlite3");
const routes = require("./routes");

const db = new Sqlite3.Database("./dindin.sqlite");

const server = new Hapi.Server();
server.connection({ host: "localhost", port: 4200 });

server.bind({ db });
server.route(routes);
server.start(() => console.log("Server running on", server.info.uri));

