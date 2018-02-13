const fs = require('fs');


const { RequireFilter } = require('../filters');
const md5 = require('md5');
const { User } = require('../models');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../config/bookshelf');
const knex = Bookshelf.knex;
const { Server } = require('../errors');


const requireFields = {
    Post: ['email', 'password'],
    Het: ['id'],
    List: ['page', 'perPage'],
    Put: ['work_email', 'work_phone']
}

module.exports = class {
    static Avatar(req, res, next) {
        return req
            .User
            .load(['profile', 'profile.avatars'])
            .then(user => {
                console.log('avatarPath', user.toJSON());

                let [avatar] = user.related('profile').related('avatars').models;
                return avatar
            })
            .then(avatar => {
                let img;
                try {
                    img = fs.readFileSync(avatar.path());
                } catch (error) {
                    img = fs.readFileSync(`${process.cwd()}/images/avatars/placeholder.png`);
                    // throw new Server.FileDoesNotExist();
                }

                res.writeHead(200, { 'Content-Type': avatar.get('mime_type') });
                res.end(img, 'binary');
            })
            .catch(next);

    }

    static UploadAvatar(req, res, next) {
        return Bookshelf
            .transaction(transacting => {
                return new Avatar({
                    name: req.file.filename,
                    mime_type: req.file.mimetype
                }).save(null, { transacting })
                    .then(avatar => new Files({
                        file_id: avatar.id,
                        file_type: 'avatars',
                        user_id: req.User.id
                    }).save(null, { transacting }))
            })
            .then(file => req.status(200).send(file))
            .catch(next);

    }


    static Put(req, res, next) {
        console.log('req.body', req.body);
        return RequireFilter
            .Check(req.body, requireFields.Put)
            .then(validated => req
                .User
                .related('profile')
                .save(req.body)
            )
            .then(user => res.json(req
                .User))
            .catch(err => next(err));
    }

}


