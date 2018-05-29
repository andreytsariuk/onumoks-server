const { Threads, RolesTypes, Courses } = require('../../db/models');
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
                    course: Joi.number().integer(),
                })
            }
        };
    }

    /**
     * Function will return all Threads with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search, course } = req.query;

        new Threads()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`])
                }
                if (course)
                    qb.where('course_id', course);
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['courses', 'groups', 'students']
            })
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next);
    }

    /**
    * Will create new Thread
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return new Threads({
            workspace_id: req.workspace.id,
            title: req.body.title,
            description: req.body.description
        })
            .save()
            .tap(newThread => {
                if (req.body.courses_ids)
                    return newThread.courses().attach(req.body.courses_ids);
                else
                    return Promise.resolve();
            })
            .tap(newThread => {
                if (req.body.groups_ids)
                    return newThread.groups().attach(req.body.groups_ids);
                else
                    return Promise.resolve();
            })
            .tap(newThread => {
                if (req.body.students_ids)
                    return newThread.students().attach(req.body.students_ids);
                else
                    return Promise.resolve();
            })
            .then(newThread => res.status(201).send(newThread))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedThread
            .refresh({ withRelated: ['courses', 'groups', 'students'] })
            .then(thread => res.status(200).send(thread))
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
        return req.requestedThread.destroy()
            .then(thread => res.status(200).send({
                code: 'thread_deleted'
            }))
            .catch(next);
    }


    static MultiDelete(req, res, next) {
        const { threads_ids } = req.query;
        return new Threads()
            .query(qb => qb.whereIn('id', threads_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'threads_deleted'
            }))
            .catch(next);
    }


}