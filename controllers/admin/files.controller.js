const { Files } = require('../../db/models');
const Promise = require('bluebird');
const Joi = require('joi');


module.exports = class {

    /**
     * Main Schema for all functions
     */
    static get Schema() {
        return {
            Create: {
                body: Joi.object().keys({
                    title: Joi.string().required(),
                    description: Joi.string().required(),

                    students_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
                    courses_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
                    groups_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
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
                })
            }
        };
    }

    /**
     * Function will return all files with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Files()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['file', 'user', 'user.profile']
            })
            .then(result => res.status(200).send({
                items: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

    /**
     * get current File
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
     * Update current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {

    }

    /**
     * Delete Current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {

    }


}