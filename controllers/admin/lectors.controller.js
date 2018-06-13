
const { RolesTypes, Roles, Users, FilesType, Clusters } = require('../../db/models');
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

                    position_id: Joi.number().integer().required(),
                })
            },
            createExist: {
                body: Joi.object().keys({
                    user_id: Joi.number().integer().required(),
                    position_id: Joi.number().integer().required()
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
                    subject_id: Joi.number().integer(),
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
        const { descending, sortBy, rowsPerPage, page, search, subject_id } = req.query;
        if (subject_id)
            return Promise.all([
                new RolesTypes.Lectors()
                    .query(qb => {
                        qb.select('*').from('users');

                        qb.innerJoin('lectors', 'lectors.user_id', 'users.id')
                        if (search) {
                            qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`])
                        }
                    })
                    .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                    .fetchPage({
                        workspace_id: req.workspace.id,
                        pageSize: rowsPerPage, // Defaults to 10 if not specified
                        page, // Defaults to 1 if not specified
                        withRelated: ['user', 'user.roles', 'user.profile.avatar', 'position']
                    }),
                searchInClusters(subject_id)
                    .then(findBestLectors)

            ])
                .spread((result, recommended) => {
                    return res.status(200).send({
                        items: result.toJSON(),
                        recommended,
                        pagination: result.pagination
                    });
                })
                .catch(next);
        else
            return new RolesTypes.Lectors()
                .query(qb => {
                    qb.select('*').from('users');

                    qb.innerJoin('lectors', 'lectors.user_id', 'users.id')
                    if (search) {
                        qb.orWhereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(search)}%`])
                    }
                })
                .orderBy(sortBy ? sortBy : 'created_at', descending === 'true' || !descending ? 'DESC' : 'ASC')
                .fetchPage({
                    workspace_id: req.workspace.id,
                    pageSize: rowsPerPage, // Defaults to 10 if not specified
                    page, // Defaults to 1 if not specified
                    withRelated: ['user', 'user.roles', 'user.profile.avatar', 'position']
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
                .Lectors({
                    workspace_id: req.workspace.id,
                    user_id: newUser.id,
                    position_id: req.body.position_id
                }).save()
            )
            .then(newLector => new Roles({
                user_id: newLector.get('user_id'),
                role_id: newLector.id,
                role_type: 'lectors'
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
            .Lectors({
                workspace_id: req.workspace.id,
                user_id: req.body.user_id,
                position_id: req.body.position_id
            })
            .save()
            .then(newLector => new Roles({
                user_id: req.body.user_id,
                role_id: newLector.id,
                role_type: 'lectors'
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
        return req.requestedLector
            .refresh({
                withRelated: ['user', 'user.roles', 'user.profile.avatar']
            })
            .then(lector => res.status(200).send(lector))
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




function searchInClusters(subject_id) {

    return new Clusters()
        .fetchAll()
        .then(clusters => Promise
            .map(clusters.models, cluster => new FilesType
                .Articles()
                .where({
                    cluster_id: cluster.id,
                    subject_id: subject_id
                })
                .count()
                .then(count => ({
                    cluster,
                    count
                }))))
        .then(arrayOfClusters => _.maxBy(arrayOfClusters, 'count').cluster)
}

function lectorStats(lector, cluster) {
    console.log('lector', lector.id)
    return new FilesType
        .Articles()
        .where({
            lector_id: lector.id
        })
        .fetchAll()
        .then(articles => _.reduce(articles.models,
            (sum, article) => sum += 1 * parseFloat(article.get('aricle_weight')),
            0))
        .then(score => {
            console.log('score', score)
            lector.set('score', score);
            return lector;
        });
}

function findBestLectors(cluster) {
    console.log('cluster', cluster.id)
    return new FilesType
        .Articles()
        .where({
            cluster_id: cluster.id
        })
        .fetchAll()
        .then(articles => {
            console.log('articles', articles.map(article => article.get('lector_id')))
            return new RolesTypes.Lectors()
                .query(qb => qb.whereIn('id', articles.map(article => article.get('lector_id'))))
                .fetchAll({
                    withRelated: ['user', 'user.roles', 'user.profile.avatar', 'position']
                })
        })
        .then(lectors => Promise.map(lectors.models, lector => lectorStats(lector, cluster)))
        .then(lectors => _.orderBy(lectors, lector => lector.get('score')))
}