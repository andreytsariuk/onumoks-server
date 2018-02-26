const V1Router = require("express").Router();
const config = require("config");
const { Workspaces } = require('../../../db/models')
const { WorkspaceController } = require('../../../controllers')



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
    .catch(next)
});


V1Router.get("/workpsace/:workspace_name", WorkspaceController.Get);

module.exports = V1Router;
