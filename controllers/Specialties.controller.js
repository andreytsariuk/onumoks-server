const { RequireFilter } = require('../filters');
const { Specialties } = require('../db/models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const Errors = require('../errors');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name', 'description'],
    Put: ['name', 'description'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {
    static List(req, res, next) {
        console.log('List')
        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => Promise
                .all([
                    new Specialties()
                        .query(function (qb) {
                            qb.limit(req.query.rowsPerPage);
                            qb.offset((req.query.page - 1) * req.query.rowsPerPage);
                        })
                        .fetchAll(),
                    new Specialties().count()
                ]))
            .spread((specialties, specialtiesCount) => {
                return res.json({
                    items: specialties,
                    page: parseInt(req.query.page),
                    rowsPerPage: parseInt(req.query.rowsPerPage),
                    total: parseInt(specialtiesCount)
                });
            })
            .catch(err => next(err));

    }
    static Post(req, res, next) {
        console.log('Create Specialties', req.body)
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => {
                console.log('Post', validated)
                return new Specialties({
                    name: validated.name,
                    note: validated.note,
                    description: validated.description
                }).save()
            })
            .then(() => { return res.end() })
            .catch(err => next(err));

    }
    static Get(req, res, next) {
        return res.json(req.Specialty);

    }

    static Put(req, res, next) {
        console.log('Create Specialties', req.body)
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => req.Specialty.save(validated))
            .then(() => res.json(req.Specialty))
            .catch(err => next(err));
    }
    static Delete(req, res) {

    }



}