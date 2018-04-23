const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { Positions } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name', 'title'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {

    /**
     * Function will return all Specialties with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Positions()
                .orderBy('created_at', 'DESC')
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
    * Will create new Specialty
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new Positions({
                workspace_id: req.workspace.id,
                name: validated.name,
                title: validated.title,
                description: validated.description,
                hours_count: validated.hours_count
            }).save())
            .then(newPosition => res.status(201).send(newPosition))
            .catch(next);
    }

    /**
     * get current position
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return res.status(200).send(req.requestedPosition);
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