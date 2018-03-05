const ApiRouter = require("express").Router();
const V1Router = require("./v1");
const { AuthorizeMidddleweare, UserIdentityMiddleware, WorkspaceIdentityMiddleware } = require('../../middleware')


ApiRouter.use(AuthorizeMidddleweare);
ApiRouter.use(UserIdentityMiddleware);
ApiRouter.use(WorkspaceIdentityMiddleware);


ApiRouter.use("/v1", V1Router);

module.exports = ApiRouter;
