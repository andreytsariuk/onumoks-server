const { Workspaces } = require('../db/models');
const Promise = require('bluebird');

module.exports = (req, res, next) => {

    if (!req.user) {
        return next(new Error('unauthorised'))
    } else {
        console.log('req.decoded', req.decoded.id)
        return new Workspaces({
            id: req.user.get('workspace_id')
        })
            .fetch({
                require: true
            })
            .then(workspace => req.workspace = workspace)
            .then(() => next())
            .catch(next);
    }
}