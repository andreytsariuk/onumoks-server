const AppRouter = require("express").Router();
const config = require("config");
const ApiRouter = require("./api");
const AuthRouter = require("./auth");
const PublicRouter = require("./public");


const path = require("path");
const { ErrorsMiddleweare } = require("../middleware");
// const { AuthorizeController, UserController } = require("../controllers");

/* GET home page. */

AppRouter.use("/api", ApiRouter);
AppRouter.use("/auth", AuthRouter);
AppRouter.use("/public", PublicRouter);


AppRouter.use("*", ErrorsMiddleweare);

module.exports = AppRouter;
