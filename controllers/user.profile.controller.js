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
            .related('profile')
            .avatar()
            .then(avatarPath => {
                console.log('avatarPath', avatarPath);
                let img;
                try {
                    img = fs.readFileSync(avatarPath);
                } catch (error) {
                    img = fs.readFileSync(`${process.cwd()}/images/avatars/placeholder.png`);
                    // throw new Server.FileDoesNotExist();
                }

                res.writeHead(200, { 'Content-Type': 'image/gif' });
                res.end(img, 'binary');
            })
            .catch(err => next(err));

    }

    static UploadAvatar(req, res, next) {
        console.log('UploadAvatar', req.file);
        return req
            .User
            .related('profile')
            .save({
                avatar: req.file.filename
            })
            .then(() => res.end())
            .catch(err => next(err));

    }
    static List(req, res) {

    }
    static Post(req, res) {

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
    static Delete(req, res) {

    }
}


