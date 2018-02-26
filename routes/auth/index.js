const AuthRouter = require("express").Router();
const V1Router = require("./v1");


AuthRouter.use("/v1", V1Router);

module.exports = AuthRouter;
