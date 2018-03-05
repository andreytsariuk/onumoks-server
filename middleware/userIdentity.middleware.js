const { Users } = require('../db/models');
const Promise = require('bluebird');

module.exports = (req, res, next) => {

    if (!req.decoded) {
        return next(new Error('unauthorised'))
    } else {
        console.log('req.decoded', req.decoded.id)
        return new Users({
            id: req.decoded.user.id
        })
            .fetch({
                require: true,
                withRelated: ['roles', 'roles.roleType', 'workspace', 'profile']
            })
            .then(user => req.user = user)
            .then(() => next())
            .catch(next);
    }
}