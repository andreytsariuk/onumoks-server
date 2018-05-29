const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Users, Roles, Courses, Specialties, Statuses } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    List: ['page', 'rowsPerPage']
}

module.exports = class {



    /**
 * Main Schema for all functions
 */
    static get Schema() {
        return {
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
                    search: Joi.string().empty('')
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
        const { descending, sortBy } = req.query;

        return new Users()
            .query(qb => {
                qb.select('*').from('users');
                qb.leftOuterJoin('profiles', 'profiles.id', 'users.id')
                if (search) {
                    qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`]);
                    qb.orWhereRaw(`LOWER(fname) LIKE ?`, [`%${_.toLower(search)}%`]);
                    qb.orWhereRaw(`LOWER(lname) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                page: validated.page, // Defaults to 1 if not specified
                withRelated: ['roles', 'profile', 'profile.avatar']
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
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedUser
            .refresh({
                withRelated: ['profile', 'profile.avatar']
            })
            .then(user => res.status(200).send(user))
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