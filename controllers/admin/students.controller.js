
const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { RolesTypes, Roles, Courses, Specialties, Statuses, Users, } = require('../../db/models');
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
            createNew: {
                body: Joi.object().keys({
                    email: Joi.string().email().required(),
                    fname: Joi.string().required(),
                    lname: Joi.string().required(),

                    specialty_id: Joi.number().integer().required(),
                    course_id: Joi.number().integer().required(),
                })
            },
            createExist: {
                body: Joi.object().keys({
                    user_id: Joi.number().integer().required(),
                    specialty_id: Joi.number().integer().required(),
                    course_id: Joi.number().integer().required(),
                })
            },
            Get: {
                query: Joi.object().keys({
                    id: Joi.number().integer().required(),
                })
            },
            List: {
                query: Joi.object().keys({
                    page: Joi.number().integer(),
                    rowsPerPage: Joi.number().integer(),
                    descending: Joi.boolean(),
                    sortBy: Joi.string(),
                    totalItems: Joi.number().integer(),
                    search: Joi.string().empty(''),
                    course: Joi.number().integer(),
                })
            }
        };
    }

    /**
     * Function will return all users with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search, course } = req.query;

        return new RolesTypes
            .Students()
            .query(qb => {
                qb.select('*').from('users');

                qb.innerJoin('students', 'students.user_id', 'users.id')
                if (search) {
                    qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`])
                }
                if (course)
                    qb.where('course_id', course);

            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage || 10, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['user', 'user.roles', 'user.profile.avatar', 'specialty', 'course', 'groups']
            })
            .then(result => {
                return res.status(200).send({
                    items: result.toJSON(),
                    pagination: result.pagination
                });
            })
            .catch(next)
    }




    /**
     * Function will carete a new student student
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static createNew(req, res, next) {
        return new Users({
            workspace_id: req.workspace.id,
            email: req.body.email
        })
            .save()
            .tap(newUser => newUser.related('profile').save({
                fname: req.body.fname,
                lname: req.body.lname
            }))
            .then(newUser => new RolesTypes
                .Students({
                    workspace_id: req.workspace.id,
                    user_id: newUser.id,
                    specialty_id: req.body.specialty_id,
                    course_id: req.body.course_id
                }).save()
            )
            .then(newStuden => new Roles({
                user_id: newStuden.get('user_id'),
                role_id: newStuden.id,
                role_type: 'students'
            }).save())
            .then(newRole => res.status(201).send(newRole))
            .catch(next);
    }


    /**
     * Will attach Student to exist user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static createExist(req, res, next) {

        return new RolesTypes
            .Students({
                workspace_id: req.workspace.id,
                user_id: validated.user_id,
                specialty_id: validated.specialty_id,
                course_id: validated.course_id
            })
            .save()
            .then(newStuden => new Roles({
                user_id: req.body.user_id,
                role_id: newStuden.id,
                role_type: 'students'
            }).save())
            .then(newRole => res.status(201).send(newRole))
            .catch(next);
    }




    /**
     * get current user
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req
            .requestedUser
            .refresh({
                withRelated: ['user.profile', 'user.roles', 'user.profile.avatar']
            })
            .then(user => res.status(200).send(user))
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

    }


}