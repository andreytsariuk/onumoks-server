const { RequireFilter } = require('../filters');
const { Subject } = require('../db/models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const Errors = require('../errors');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['title', 'description'],
    Het: ['id'],
    List: ['page', 'perPage']
}

module.exports = class {
    static List(req, res, next) {
        console.log('List')
        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => Promise
                .all([
                    new Subject()
                        .query(function (qb) {
                            qb.limit(req.query.perPage);
                            qb.offset((req.query.page - 1) * req.query.perPage);
                        })
                        .fetchAll(),
                    new Subject().count()
                ]))
            .spread((subjects, subjectsCount) => {
                return res.json({
                    items: subjects,
                    page: parseInt(req.query.page),
                    perPage: parseInt(req.query.perPage),
                    total: parseInt(subjectsCount)
                });
            })
            .catch(err => next(err));

    }
    static Post(req, res, next) {
        console.log('Create Subject', req.body)
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated =>
                new Subject({
                    title: validated.title,
                    description: validated.description
                }).save())
            .then(res.end())
            .catch(err => next(err));

    }

    static Put(req, res) {

    }
    static Delete(req, res) {

    }



}