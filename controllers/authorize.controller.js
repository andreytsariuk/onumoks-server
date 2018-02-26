const { RequireFilter } = require('../filters');
const { User } = require('../db/models');
const _ = require('lodash');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('config');
const requireFields = {
    Post: ['email', 'password'],
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
        console.log('req.session', req.session);
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new User({
                email: _.get(req.body, 'email'),
                password: md5(_.get(req.body, 'password'))
            })
                .fetch({ require: true }))
            .then(user => {
                user.set('token', jwt.sign({ user }, config.get('secret')))
                res.send(user);
            })
            .catch(err => {
                if (err instanceof User.NotFoundError) {
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