const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Threads, RolesTypes, Courses } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['title'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all Threads with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Threads()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                    withRelated: ['cources', 'groups', 'students']
                }))
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
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Threads({
                workspace_id: req.workspace.id,
                title: validated.title,
                description: validated.description
            }).save())
            .tap(newThread => {
                if (req.body.courses)
                    return newThread.courses().attach(req.body.courses);
                else
                    return Promise.resolve();
            })
            .tap(newThread => {
                if (req.body.groups)
                    return newThread.groups().attach(req.body.groups);
                else
                    return Promise.resolve();
            })
            .tap(newThread => {
                if (req.body.students)
                    return newThread.students().attach(req.body.students);
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
            .refresh({ withRelated: ['cources', 'groups', 'students'] })
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