const { LoadItems, Subjects, LessonTypes } = require('../../db/models');
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
                    hours_count: Joi.number().min(0.00001).required(),
                    lector_id: Joi.number().integer().required(),
                    subject_id: Joi.number().integer().required(),
                    lesson_type_id: Joi.number().integer().required(),
                    group_id: Joi.number().integer().empty(undefined).empty(null),
                    thread_id: Joi.number().integer().empty(undefined).empty(null),
                    course_id: Joi.number().integer().empty(undefined).empty(null),
                })
            },
            Get: {
                query: Joi.object().keys({
                    id: Joi.number().integer().required(),
                })
            },
            List: {
                // query: Joi.object().keys({
                //     page: Joi.number().integer(),
                //     rowsPerPage: Joi.number().integer(),
                //     descending: Joi.boolean(),
                //     sortBy: Joi.string(),
                //     totalItems: Joi.number().integer(),
                //     search: Joi.string().empty(''),
                // })
            }
        };
    }

    /**
     * Function will return all LoadItems
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {

        return Promise.all([
            new LoadItems()
                .query(qb => {
                    qb.leftOuterJoin('subjects', 'load_items.subject_id', 'subjects.id')
                    qb.innerJoin('loads', 'loads.id', 'load_items.load_id');
                })
                .fetchAll({
                    withRelated: [
                        'course',
                        'course.specialty',
                        'lector',
                        'lector.user',
                        'lector.user.profile',
                        'lector.position',
                        'lector.user.profile.avatar',
                        'group',
                        'group.students',
                        'group.course',
                        'group.course.specialty',
                        'thread',
                        'thread.groups',
                        'thread.groups.course',
                        'thread.groups.course.specialty',
                        'thread.courses',
                        'thread.courses.specialty',
                        'thread.students',
                        'thread.students.specialty',
                        'lessonType',
                        'subject',
                    ]
                }),
            new LoadItems()
                .where('load_id', req.requestedLoad.id)
                .fetchAll()
                .then(res => res.models.map(model => model.get('lesson_type_id')))
                .then(arrayOfIds => _.uniq(arrayOfIds))
                .then(arrayOfIds => new LessonTypes()
                    .query(qb => qb.whereIn('id', arrayOfIds))
                    .fetchAll()
                )
        ])
            .spread((rows, cols) => res.status(200).send({
                rows: rows.toJSON(),
                cols: cols.toJSON(),
            }))
            .catch(next);
    }

    /**
    * Will create new LoadItem
    * @param {*} req 
    * @param {*} res 
    * @param {*} next 
    */
    static Post(req, res, next) {
        return req.requestedLoad
            .loadItems()
            .create({
                hours_count: req.body.hours_count,
                lector_id: req.body.lector_id,
                subject_id: req.body.subject_id,
                lesson_type_id: req.body.lesson_type_id,
                group_id: req.body.group_id,
                thread_id: req.body.thread_id,
                course_id: req.body.course_id,
            })
            .then(newLoadItem => res.status(201).send(newLoadItem))
            .catch(next);
    }

    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedLoadItem
            .refresh({
                withRelated: [
                    'course',
                    'course.specialty',
                    'lector',
                    'lector.user',
                    'lector.user.profile',
                    'lector.user.profile.avatar',
                    'group',
                    'group.students',
                    'group.specialty',
                    'thread',
                    'thread.groups',
                    'thread.courses',
                    'thread.students',
                    'lessonType',
                    'subject',
                ]
            })
            .then(loadItem => res.status(200).send(loadItem))
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
        return req.requestedLoadItem.destroy()
            .then(loadItem => res.status(200).send({
                code: 'loadItem_item_deleted'
            }))
            .catch(next);
    }

    static MultiDelete(req, res, next) {
        const { loadItems_ids } = req.query;
        return new LoadItems()
            .query(qb => qb.whereIn('id', loadItems_ids))
            .fetchAll(result => Promise
                .map(result.models, model => model.destroy()))
            .then(() => res.status(200).send({
                code: 'load_items_deleted'
            }))
            .catch(next);
    }


}