const AppRouter = require("express").Router();
const config = require("config");
// const ApiRouter = require("./api");
const AuthRouter = require("./auth");

const path = require("path");
const { ErrorsMiddleweare, AuthorizeMidddleweare } = require("../middleware");
// const { AuthorizeController, UserController } = require("../controllers");

/* GET home page. */

// AppRouter.use("/api", Api);
AppRouter.use("/auth", AuthRouter);

AppRouter.use("*", ErrorsMiddleweare);

module.exports = AppRouter;
