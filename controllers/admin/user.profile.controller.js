const { User, FilesType, Files } = require('../../db/models');
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
                    title: Joi.string().required(),
                    description: Joi.string().required(),

                    students_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
                    courses_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
                    groups_ids: Joi.array().items(Joi.number().integer()).empty(undefined).empty(null),
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
     * Function will upload avatar file and attach it to user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static UploadAvatar(req, res, next) {
        return Bookshelf
            .transaction(transacting => {
                return new FilesType
                    .Avatars({
                        name: req.file.filename,
                        mime_type: req.file.mimetype
                    })
                    .save(null, { transacting })
                    .then(avatar => Promise
                        .all([
                            new Files({
                                file_id: avatar.id,
                                file_type: 'avatars',
                                user_id: req.requestedUser.id,
                                workspace_id: req.workspace.id
                            })
                                .save(null, { transacting }),
                            req.requestedUser.related('profile').save({
                                avatar_id: avatar.id
                            }, { transacting })
                        ])
                    )
                    .spread((file) => file)
            })
            .then(file => req.requestedUser.refresh({
                withRelated: ['roles', 'profile', 'profile.avatar']
            }))
            .then(user => res.status(201).send(user))
            .catch(next);
    }




    static update(req, res, next) {
        return req
            .requestedUser
            .related('profile')
            .save(req.body)
            .then(user => req.requestedUser.refresh({
                withRelated: ['roles', 'profile', 'profile.avatar']
            }))
            .then(user => res.status(200).send(user))
            .catch(err => next(err));
    }

}


