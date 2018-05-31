const { LessonTypes } = require('../../db/models');
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
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    hours_count: Joi.number().required()
                })
            },
            Get: {
                query: Joi.object().keys({
                    id: Joi.number().integer().required(),
                })
            },
            Put: {
                body: Joi.object().keys({
                    name: Joi.string(),
                    description: Joi.string(),
                    hours_count: Joi.number()
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
     * Function will return all LessonTypes with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new LessonTypes()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(name) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
            })
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next)
    }

    /**
    * Will create new LessonType
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new LessonTypes({
            workspace_id: req.workspace.id,
            name: req.body.name,
            hours_count: req.body.hours_count,
            description: req.body.description
        })
            .save()
            .then(newLessonType => res.status(201).send(newLessonType))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return res.status(200).send(req.requestedLessonType);
    }


    /**
     * Will Update current LessonType
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {
        return req.requestedLessonType
            .save({
                name: req.body.name,
                hours_count: req.body.hours_count,
                description: req.body.description
            })
            .then(newLessonType => res.status(200).send(newLessonType))
            .catch(next);
    }


    /**
     * Delete Current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {
        return req.requestedLessonType
            .destroy()
            .then(() => res.status(200).send({
                code: 'lesson_type_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { lesson_types_ids } = req.query;
        return new LessonTypes()
            .query(qb => qb.whereIn('id', lesson_types_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'lesson_types_deleted'
            }))
            .catch(next);
    }


}