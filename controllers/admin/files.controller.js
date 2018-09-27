const { Files, FilesType } = require('../../db/models');
const Promise = require('bluebird');
const Joi = require('joi');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const { S3Service } = require('../../services')
const fs = require('fs');
const config = require('config');

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
                })
            }
        };
    }

    /**
     * Function will return all files with paggination
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static List(req, res, next) {
        const { descending, sortBy, rowsPerPage, page, search } = req.query;

        return new Files()
            .query(qb => {
                if (search) {
                    qb.orWhereRaw(`LOWER(title) LIKE ?`, [`%${_.toLower(search)}%`]);
                }
            })
            .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
            .fetchPage({
                workspace_id: req.workspace.id,
                pageSize: rowsPerPage, // Defaults to 10 if not specified
                page, // Defaults to 1 if not specified
                withRelated: ['file', 'user', 'user.profile']
            })
            .then(result => res.status(200).send({
                items: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

    /**
    * Function will upload new file file and attach it to user
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Create(req, res, next) {
        console.log('BODY', req.body)
        let fileType;
        let newFile = {};
        switch (req.file_type) {
            case 'articles':
                fileType = 'Articles';
                newFile = {
                    name: req.file.filename,
                    aricle_weight: req.body.aricle_weight ? req.body.aricle_weight : 0,
                    mime_type: req.file.mimetype,
                    lector_id: req.body.lector_id ? req.body.lector_id : undefined,
                    subject_id: req.body.subject_id ? req.body.subject_id : undefined,
                }
                break;
            default:
                throw new Error('unknown_file_type')
        }

        return Bookshelf
            .transaction(transacting => {
                return new FilesType[fileType](newFile)
                    .save(null, { transacting })
                    .then(createdFileType => new Files({
                        file_id: createdFileType.id,
                        file_type: req.file_type,
                        user_id: req.user.id,
                        title: req.body.title,
                        workspace_id: req.workspace.id
                    })
                        .save(null, { transacting })
                        .then(() => createdFileType)
                    )
            })
            .tap(createdFileType => Promise
                .fromCallback(cb => fs
                    .readFile(`./public/${req.file_type}/${createdFileType.get('name')}`, (err, data) => {
                        if (err)
                            throw err;
                        const base64data = new Buffer(data, 'binary');
                        return S3Service.put({
                            Key: createdFileType.get('name'),
                            Body: base64data,
                            Bucket: config.get('AWS.S3.bucket')
                        })
                            .then((res) => createdFileType.save({
                                s3_key: res.ETag
                            }))
                            .then(() => cb())
                            .catch(cb);
                    })
                )
            )
            .tap(createdFileType => res.status(201).send(createdFileType))
            .catch(next);
    }

    /**
     * get current File
     * @param {*} req 
     * @param {*} res 
     */
    static Get(req, res, next) {
        return req.requestedUser
            .refresh({
                withRelated: ['profile', 'profile.avatar']
            })
            .then(user => res.status(200).send(user))
            .catch(next);
    }

    /**
     * Update current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Put(req, res, next) {

    }

    /**
     * Delete Current File
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    static Delete(req, res, next) {
        return S3Service
            .delete({
                Key: req.requestedFile.related('file').get('name'),
                Bucket: config.get('AWS.S3.bucket')
            })
            .catch(err => {
                console.log('Errr', err)
                return {};
            })
            .then(() => req.requestedFile.related('file').destroy())
            .then(() => req.requestedFile.destroy())
            .then(thread => res.status(200).send({
                code: 'thread_deleted'
            }))
            .catch(next);
    }


}