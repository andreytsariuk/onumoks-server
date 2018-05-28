const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Groups, RolesTypes, Courses } = require('../../db/models');
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
     * Function will return all Groups with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy } = req.query;

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Groups()
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                    page: validated.page, // Defaults to 1 if not specified
                    withRelated: ['cource', 'cource.specialty', 'students']
                }))
            .then(result => res.status(200)
                .send({
                    items: result.toJSON(),
                    pagination: result.pagination
                }))
            .catch(next);
    }

    /**
    * Will create new Group
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Groups({
                workspace_id: req.workspace.id,
                cource_id: req.body.cource_id,
                title: validated.title,
                description: validated.description
            }).save())
            .tap(newGroup => {
                if (req.body.students)
                    return newGroup.students().attach(req.body.students);
                else
                    return Promise.resolve();
            })
            .then(newGroup => res.status(201).send(newGroup))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedGroup
            .refresh({ withRelated: ['cource', 'cource.specialty', 'students'] })
            .then(group => res.status(200).send(group))
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
        return req.requestedGroup.destroy()
            .then(group => res.status(200).send({
                code: 'group_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { groups_ids } = req.query;
        return new Groups()
            .query(qb => qb.whereIn('id', groups_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'groups_deleted'
            }))
            .catch(next);
    }


}