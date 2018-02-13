const Promis = require('bluebird');
const { Students } = require('../../db/models').RolesTypes;
const { Users } = require('../../db/models');

const requireFields = {
    List: [],
    Create: ['email', 'password'],
    Verify: ['token']
};



module.exports = class {



    static list(req, res, next) {

        return RequireFilter
            .Check(req.body, requireFields.List)
            .then(validated => new Students())
            .orderBy('created_at', 'DESC')
            .query(qb => {
                // if (req.params.search && req.params.search !== 'undefined')
                //     qb.whereRaw(`LOWER(name) LIKE ?`, [`%${_.toLower(req.params.search)}%`])
            })
            .fetchPage({
                pageSize: req.params.pageSize || 10,
                page: req.params.page || 1,
            }, {
                    withRelated: ['roles', {
                        'roles.user': (qb) => {
                            if (req.params.search && req.params.search !== 'undefined')
                                qb.whereRaw(`LOWER(email) LIKE ?`, [`%${_.toLower(req.params.search)}%`]);
                        },
                        'roles.user.profile': (qb) => {
                            if (req.params.search && req.params.search !== 'undefined') {
                                qb.whereRaw(`LOWER(fname) LIKE ?`, [`%${_.toLower(req.params.search)}%`]);
                                qb.whereRaw(`LOWER(lname) LIKE ?`, [`%${_.toLower(req.params.search)}%`]);
                            }
                        }
                    }]
                })
            .then(result => res.status(200).send({
                data: result.toJSON(),
                pagination: result.pagination
            }))
            .catch(next)
    }

    static create(req, res, next) {

        return RequireFilter
            .Check(req.body, requireFields.Create)
            .then(validated => new Students({}).save())
            .then(student => new Users())

    }

    static get(req, res, next) {

        return new Users({
            id: req.student.related('role').get('user_id')
        })
            .fetch({
                require: true,
                withRelated: ['roles', 'roles.type', 'profile', 'profile.avatar']
            })
            .then(user => res.status(200).send(user))
            .catch(next);

    }



}