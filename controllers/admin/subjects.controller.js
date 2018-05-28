const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Subjects } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name', 'title'],
    Get: ['id'],
    List: ['page', 'rowsPerPage'],
    Put: ['name', 'title']
}

module.exports = class {

    /**
     * Function will return all Subjects with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Subjects()
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
    * Will create new Subject
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Subjects({
                workspace_id: req.workspace.id,
                name: validated.name,
                title: validated.title,
                description: validated.description
            }).save())
            .then(newSubject => res.status(201).send(newSubject))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return res.status(200).send(req.requestedSubject);
    }


    /**
     * Will Update current Subject
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Put)
            .then(validated => req.requestedSubject.save({
                name: validated.name,
                title: validated.title,
                description: validated.description
            }))
            .then(newSubject => res.status(200).send(newSubject))
            .catch(next);
    }


    /**
     * Delete Current User
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {
        return req.requestedSubject
            .destroy()
            .then(() => res.status(200).send({
                code: 'subject_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { subjects_ids } = req.query;
        return new Subjects()
            .query(qb => qb.whereIn('id', subjects_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'subjects_deleted'
            }))
            .catch(next);
    }


}