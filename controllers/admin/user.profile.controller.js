const fs = require('fs');


const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { User, FilesType, Files } = require('../../db/models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const { Server } = require('../../errors');


const requireFields = {
    Post: ['email', 'password'],
    Het: ['id'],
    List: ['page', 'perPage'],
    Put: ['work_email', 'work_phone']
}

module.exports = class {

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
                            }).save(null, { transacting }),
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
        console.log('req.body', req.body);
        return RequireFilter
            .Check(req.body, requireFields.Put)
            .then(validated => req
                .requestedUser
                .related('profile')
                .save(req.body)
            )
            .then(user => req.requestedUser.refresh({
                withRelated: ['roles', 'profile', 'profile.avatar']
            }))
            .then(user => res.status(200).send(user))
            .catch(err => next(err));
    }

}


