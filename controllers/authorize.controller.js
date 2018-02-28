const { RequireFilter } = require('../filters');
const { Users } = require('../db/models');
const _ = require('lodash');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('config');
const requireFields = {
    Post: ['email', 'password', 'workspace_id'],
    Verify: ['token']
}
const Errors = require('../errors');


module.exports = class {

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Post(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Users({
                email: validated.email,
                password: md5(validated.password),
                workspace_id: validated.workspace_id
            })
                .fetch({
                    require: true,
                    withRelated: ['profile', 'profile.avatars', 'roles', 'workspace']
                },
            ))
            .then(user => res.status(200).send({
                user: user.toJSON(),
                access_token: jwt.sign({ user }, config.get('secret')),
                workspace: user.related('workspace').toJSON(),
                roles: user.roles
            }))
            .catch(err => {
                if (err instanceof Users.NotFoundError) {
                    return next(new Errors.Server.InvalidCredentials());
                }
                next(err);
            });

    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Verify(req, res, next) {
        if (!RequireFilter.Check(req.body, requireFields.Verify))
            return res.status(401).send('Unathorize')

        new User({
            access_token: _.get(req.body, 'token')
        })
            .fetch({ require: true })
            .then(result => {
                return res.json(result.toJSON());
            })
            .catch(err => {
                console.log(err)
                switch (true) {
                    case err.message === 'EmptyResponse':
                        res.status(404).send('User Not Found');
                        break;
                    default:
                        res.status(500).send(err.message ? err.message : 'Server Error');
                        break;
                }

            })
    }
}

// verify = (headers) => {
//     if (headers && headers.authorization) {
//       const split = headers.authorization.split(' ');
//     if (split.length === 2) return split[1];
//       else return null;
//     } else return null;
//   }