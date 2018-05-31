
const { RolesTypes, Roles, Users } = require('../../db/models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Joi = require('joi');

module.exports = class {

    /**
     * Main Schema for all functions
     */
    static get Schema() {
        return {
            createNew: {
                body: Joi.object().keys({
                    email: Joi.string().email().required(),
                    fname: Joi.string().required(),
                    lname: Joi.string().required(),

                    position_id: Joi.number().integer().required(),
                })
            },
            createExist: {
                body: Joi.object().keys({
                    user_id: Joi.number().integer().required(),
                    position_id: Joi.number().integer().required()
                })
            },
            Get: {
                query: Joi.object().keys({
                    id: Joi.number().integer().required(),
                })
            },
            List: {
                query: Joi.object().keys({
                    page: Joi.number().integer(),
                    rowsPerPage: Joi.number().integer(),
                    descending: Joi.boolean(),
                    sortBy: Joi.string(),
                    totalItems: Joi.number().integer(),
                    search: Joi.string().empty(''),
                    course: Joi.number().integer(),
                })
            }
        };
    }


    /**
     * Function will return all users with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new RolesTypes.Lectors()
            .query(qb => {
                qb.select('*').from('users');

                qb.innerJoin('lectors', 'lectors.user_id', 'users.id')
                if (search) {
                    qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`])
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['user', 'user.roles', 'user.profile.avatar', 'position']
            })
            .then(result => {
                return res.status(200).send({
                    items: result.toJSON(),
                    pagination: result.pagination
                });
            })
            .catch(next)
    }




    /**
     * Function will carete a new student student
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static createNew(req, res, next) {
        return new Users({
            workspace_id: req.workspace.id,
            email: req.body.email
        })
            .save()
            .tap(newUser => newUser.related('profile').save({
                fname: req.body.fname,
                lname: req.body.lname
            }))
            .then(newUser => new RolesTypes
                .Lectors({
                    workspace_id: req.workspace.id,
                    user_id: newUser.id,
                    position_id: req.body.position_id
                }).save()
            )
            .then(newLector => new Roles({
                user_id: newLector.get('user_id'),
                role_id: newLector.id,
                role_type: 'lectors'
            }).save())
            .then(newRole => res.status(201).send(newRole))
            .catch(next);
    }


    /**
     * Will attach Student to exist user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static createExist(req, res, next) {

        return new RolesTypes
            .Lectors({
                workspace_id: req.workspace.id,
                user_id: req.body.user_id,
                position_id: req.body.position_id
            })
            .save()
            .then(newLector => new Roles({
                user_id: req.body.user_id,
                role_id: newLector.id,
                role_type: 'lectors'
            }).save())
            .then(newRole => res.status(201).send(newRole))
            .catch(next);
    }




    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedLector
            .refresh({
                withRelated: ['user', 'user.roles', 'user.profile.avatar']
            })
            .then(lector => res.status(200).send(lector))
            .catch(next);
    }

    /**
     * Update current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {

    }
    /**
     * Delete Current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {

    }


}