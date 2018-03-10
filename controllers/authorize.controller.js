const { RequireFilter } = require('../filters');
const { Users, Profiles, Invites, RolesTypes } = require('../db/models');
const _ = require('lodash');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('config');
const requireFields = {
    Post: ['email', 'password', 'workspace_id'],
    Verify: ['token'],
    signUpViaInvite: ['email', 'fname', 'lname', 'password', 'work_email', 'work_phone']
}
const Errors = require('../errors');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const { InviteRulesHelper } = require('../helpers')

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
                    withRelated: ['profile', 'profile.avatar', 'roles', 'workspace']
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

    static signUpViaInvite(req, res, next) {

        return Bookshelf
            .transaction((transacting) => RequireFilter
                .Check(req.body, requireFields.signUpViaInvite)
                .then(validated => req.invite.validate({ expired: false }))
                .then(invite => new Users({
                    email: req.body.email,
                    password: md5(req.body.password),
                    workspace_id: req.workspace.id
                }).save(null, { transacting }))
                .then(user => req.user = user)
                .then(user => new Profiles({
                    user_id: req.user.id,
                    gender: req.body.gender,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    work_phone: req.body.work_phone,
                    work_email: req.body.work_email,
                }).save(null, { transacting }))
                .then(user => InviteRulesHelper.validate(req.invite.get('rules')))
                .then(rulesObject => Promise
                    .map(rulesObject.roles, role_type => {
                        switch (role_type) {
                            case 'students':
                                return new RolesTypes.Students().save({}, { transacting })

                            case 'admins':
                                return new RolesTypes.Admins().save({}, { transacting })

                            case 'lectors':
                                return new RolesTypes.Lectors().save({}, { transacting })

                            default:
                                throw new Error('unknown_role_type')
                        }
                    }))

            )
            .then(newRoles => req.user
                .refresh({
                    require: true,
                    withRelated: ['roles']
                })
                .then(() => {

                    console.log('req.user', )
                    return newRoles;
                }))
            .map(role => req.user.related('roles').create({
                role_id: role.id,
                role_type: role.tableName
            }))
            .then(() => req.invite.markAsUsed(req.invite.get('email'), req.user))
            .then(() => req.user
                .refresh({
                    require: true,
                    withRelated: ['profile', 'profile.avatar', 'roles', 'workspace', 'workspace.avatar']
                }))
            .then(user => res.status(200).send({
                user: user.toJSON(),
                access_token: jwt.sign({ user }, config.get('secret')),
                workspace: user.related('workspace').toJSON(),
                roles: user.roles
            }))
            .catch(err => {
                console.log('err.message', err.message);

                switch (true) {
                    case err.message.indexOf('unique constraint') !== -1:

                        return next(new Error('sser_already_exists'))

                    default:
                        return next(err);
                }

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