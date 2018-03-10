const V1Router = require("express").Router();
const config = require("config");
const { Workspaces, Invites } = require('../../../db/models')
const { WorkspaceController, AuthorizeController } = require('../../../controllers')



V1Router.post("/user", AuthorizeController.Post);

V1Router.post("/user", AuthorizeController.Post);



//---------------------Router Params----------------------------

V1Router.param('workspace_name', function (req, res, next, workspace_name) {
  // try to get the user workpsace from the User model and attach it to the request object
  return new Workspaces({
    name: workspace_name
  })
    .fetch({
      require: true,
      withRelated: ['avatar']
    })
    .then(workspace => req.workspace = workspace)
    .then(() => next())
    .catch(next)
});

V1Router.param('invite', function (req, res, next, invite) {
  // try to get the user workpsace from the User model and attach it to the request object
  return new Invites({
    token: invite
  })
    .fetch({
      require: true
    })
    .then(invite => req.invite = invite)
    .then(() => next())
    .catch(next)
});

V1Router.post("/sign-up/:workspace_name/invite/:invite", AuthorizeController.signUpViaInvite);

V1Router.get("/workspace/:workspace_name", WorkspaceController.Get);


module.exports = V1Router;
