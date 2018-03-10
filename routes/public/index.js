const PublicRouter = require("express").Router();
const V1Router = require("./v1");


PublicRouter.use("/v1", V1Router);

module.exports = PublicRouter;
