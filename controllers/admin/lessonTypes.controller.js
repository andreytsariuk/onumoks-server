const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { LessonTypes } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name'],
    Get: ['id'],
    List: ['page', 'rowsPerPage'],
    Put: ['name']
}

module.exports = class {

    /**
     * Function will return all LessonTypes with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new LessonTypes()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                }))
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
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new LessonTypes({
                workspace_id: req.workspace.id,
                name: validated.name,
                hours_count: validated.hours_count,
                description: validated.description
            }).save())
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
        return RequireFilter
            .Check(req.body, requireFields.Put)
            .then(validated => req.requestedLessonType.save({
                name: validated.name,
                hours_count: validated.hours_count,
                description: validated.description
            }))
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