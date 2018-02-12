const { RequireFilter } = require('../filters');
const { Courses } = require('../models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const Errors = require('../errors');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['name', 'specialty_id', 'age', 'year'],
    Put: ['name', 'specialty_id', 'age', 'year'],
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
                    new Courses()
                        .query(function (qb) {
                            qb.limit(req.query.rowsPerPage);
                            qb.offset((req.query.page - 1) * req.query.rowsPerPage);
                        })
                        .fetchAll({ withRelated: ['specialty'] }),
                    new Courses().count()
                ]))
            .spread((Courses, CoursesCount) => {
                return res.json({
                    items: Courses,
                    page: parseInt(req.query.page),
                    rowsPerPage: parseInt(req.query.rowsPerPage),
                    total: parseInt(CoursesCount)
                });
            })
            .catch(err => next(err));

    }
    static Post(req, res, next) {
        console.log('Create Courses', req.body)
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => {
                console.log('Post', validated)
                return new Courses({
                    name: validated.name,
                    note: validated.note,
                    specialty_id: validated.specialty_id,
                    year: validated.year,
                    age: validated.age

                }).save()
            })
            .then(() => { return res.end() })
            .catch(err => next(err));

    }
    static Get(req, res, next) {

        req.Course
            .load(['specialty'])
            .then(course => {
                return res.json(course);
            })


    }

    static Put(req, res, next) {
        console.log('Update Courses', req.body)
        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => req.Course.save({
                name: validated.name,
                note: validated.note,
                specialty_id: validated.specialty_id,
                year: validated.year,
                age: validated.age

            }))
            .then(() => res.json(req.Specialty))
            .catch(err => next(err));
    }
    static Delete(req, res) {

    }



}