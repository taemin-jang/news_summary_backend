import config from "@config";
import { Application } from "express";

const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore({
  host: config.host,
  port: config.mysql_port,
  user: config.user,
  password: config.password,
  database: config.database,
});

export default (app: Application) => {
  app.use(
    session({
      key: config.session_key,
      secret: config.session_secret,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
};
