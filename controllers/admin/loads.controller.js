const { Load, LoadItems } = require('../../db/models');
const Errors = require('../../errors');
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
            Create: {
                body: Joi.object().keys({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
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
     * Function will return all Loads with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Load()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`])
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page,// Defaults to 1 if not specified
                withRelated: ['loadItems']
            })
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next);
    }

    /**
    * Will create new Load
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new Load({
            workspace_id: req.workspace.id,
            title: req.body.title,
            description: req.body.description
        })
            .save()
            .then(newLoad => res.status(201).send(newLoad))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedLoad
            .refresh({
                withRelated: [
                    'loadItems',
                    'loadItems.course',
                    'loadItems.course.specialty',
                    'loadItems.lector',
                    'loadItems.lector.user',
                    'loadItems.lector.user.profile',
                    'loadItems.lector.user.profile.avatar',
                    'loadItems.group',
                    'loadItems.group.students',
                    'loadItems.group.course',
                    'loadItems.group.course.specialty',
                    'loadItems.thread',
                    'loadItems.thread.loads',
                    'loadItems.thread.courses',
                    'loadItems.thread.students',
                    'loadItems.lessonType',
                    'loadItems.subject',
                ]
            })
            .then(load => res.status(200).send(load))
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
        return req.requestedLoad.destroy()
            .then(load => res.status(200).send({
                code: 'load_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { loads_ids } = req.query;
        return new Load()
            .query(qb => qb.whereIn('id', loads_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'loads_deleted'
            }))
            .catch(next);
    }


}