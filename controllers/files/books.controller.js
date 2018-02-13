const { RequireFilter } = require('../filters');
const { Books } = require('../models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const Errors = require('../errors');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['title', 'description'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {
    static List(req, res, next) {
        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => Promise
                .all([
                    new Books()
                        .query(function (qb) {
                            qb.limit(req.query.rowsPerPage);
                            qb.offset((req.query.page - 1) * req.query.rowsPerPage);
                        })
                        .fetchAll(),
                    new Books().count()
                ]))
            .spread((books, booksCount) => {
                return res.json({
                    items: books,
                    page: parseInt(req.query.page),
                    rowsPerPage: parseInt(req.query.rowsPerPage),
                    total: parseInt(booksCount)
                });
            })
            .catch(err => next(err));

    }
    static Post(req, res) {
        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => new Subject({
                title: validated.title,
                description: validated.description
            }))
            .catch(err => next(err));

    }

    static Put(req, res) {

    }
    static Delete(req, res) {

    }



}