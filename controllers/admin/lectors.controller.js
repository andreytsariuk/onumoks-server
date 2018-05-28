
const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { RolesTypes, Roles, Courses, Specialties, Statuses, Users, } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['email', 'role', 'fname', 'lname'],
    createNew: ['email', 'fname', 'lname', 'position_id'],
    createExist: ['user_id', 'position_id'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all users with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new RolesTypes.Lectors()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                    withRelated: ['user', 'user.roles', 'user.profile.avatar', 'position']
                }))
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
        return RequireFilter
            .Check(req.body, requireFields.createNew)
            .then(validated => new Users({
                workspace_id: req.workspace.id,
                email: validated.email
            }).save())
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

        return RequireFilter
            .Check(req.body, requireFields.createExist)
            .then(validated => new RolesTypes
                .Lectors({
                    workspace_id: req.workspace.id,
                    user_id: validated.user_id,
                    position_id: req.body.position_id
                }).save()
            )
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