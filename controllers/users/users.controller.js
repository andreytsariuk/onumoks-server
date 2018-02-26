const { RequireFilter } = require('../../filters');
const md5 = require('md5');
const { User, Roles, Courses, Specialties, Statuses } = require('../../db/models');
const Errors = require('../../errors');
const _ = require('lodash');
const Promise = require('bluebird');
const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const requireFields = {
    Post: ['email', 'role', 'fname', 'lname'],
    Het: ['id'],
    List: ['page', 'rowsPerPage']
}

module.exports = class {
    static List(req, res, next) {

        return RequireFilter
            .Check(req.query, requireFields.List)
            .then(validated => Promise
                .all([
                    new User()
                        .query(function (qb) {

                            console.log('req.query', req.query);
                            qb
                                .select(knex.raw('users.*'))
                                .leftOuterJoin('profiles', 'users.id', 'profiles.user_id')
                                .leftOuterJoin('roles_users', 'users.id', 'roles_users.user_id')
                                .leftOuterJoin('roles', 'roles_users.role_id', 'roles.id')


                            if (req.query.filter) {
                                let filter = JSON.parse(req.query.filter);
                                if (filter.all) {

                                    qb
                                        .where(knex.raw(`LOWER(profiles.fname) like '%${filter.all}%'`))
                                        .orWhere(knex.raw(`LOWER(profiles.lname) like '%${filter.all}%'`))
                                        .orWhere(knex.raw(`LOWER(users.email) like '%${filter.all}%'`))

                                }
                                if (filter.role) {
                                    qb
                                        .where('roles.name', filter.role)

                                }
                            }
                            console.log('qb', qb.toString())
                        })
                        .fetchPage({
                            pageSize: validated.rowsPerPage, // Defaults to 10 if not specified
                            page: validated.page, // Defaults to 1 if not specified
                            withRelated: ['roles', 'profile']
                        })
                    // .then(users => users.models)
                    // .map(user => user
                    //     .related('profile')
                    //     .avatar()
                    //     .then(path => user
                    //         .set('avatar', path)
                    //     )),
                    ,
                    new User().count()
                ]))
            .spread((users, usersCount) => {
                console.log('usersCount', usersCount);
                users = users.map(user => user.toJSON()).map(user => { user.roles = _.map(user.roles, 'name'); return user; });
                return res.json({
                    items: users,
                    page: parseInt(req.query.page),
                    rowsPerPage: parseInt(req.query.rowsPerPage),
                    total: parseInt(usersCount)
                });
            })
            .catch(err => next(err))

    }
    static Post(req, res, next) {
        let _validated;

        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => {
                _validated = validated;
                return new Statuses({
                    name: validated.password ? 'live' : 'inactive'
                })
                    .fetch({ require: true })
                    .then(status =>
                        new User({
                            email: _.get(req.body, 'email'),
                            password: validated.password ? md5(validated.password) : 'no_password',
                            status: status.id
                            // course: []
                        })
                            .save()
                            .catch(err => {
                                if (err.constraint) {
                                    switch (true) {
                                        case err.constraint === 'users_email_unique':
                                            throw new Errors.User.EmailExist()
                                            break;

                                        default:
                                            break;
                                    }
                                }
                            })
                    )

            })
            .tap(newUser => newUser.related('profile').save({
                fname: _validated.fname,
                lname: _validated.lname,
                personal_phone: _validated.personal_phone,
                work_phone: _validated.work_phone,
                personal_email: _validated.personal_email,
                work_email: _validated.work_email
            }))
            .tap(newUser => new Roles({
                name: _validated.role
            })
                .fetch({ require: true })
                .then(role => newUser
                    .roles()
                    .attach(role))
            )
            .tap(newUser => _validated.course && new Courses({
                id: _validated.course
            })
                .fetch({ require: true })
                .then(course => newUser
                    .course()
                    .attach(course))
            )
            .tap(newUser => _validated.specialty && new Specialties({
                id: _validated.specialty
            })
                .fetch({ require: true })
                .then(specialty => newUser
                    .specialty()
                    .attach(specialty))
            )
            .then(() => res.end())
            .catch(err => next(err))

    }

    static Get(req, res) {
        return res.send(req.User);

    }
    static Registration(req, res) {

        return RequireFilter
            .Check(req.body, requireFields.Post)
            .then(validated => new User({
                email: _.get(req.body, 'email'),
                password: md5(_.get(req.body, 'password'))
            }))
            .save()
            .then(user => user.CreateToken())
            .then(user => res.json(user.toJSON()))
            .catch(err => next(err))

    }
    static Put(req, res) {

    }
    static Delete(req, res) {

    }
    static Stats(req, res) {
        new User({
            id: req.user.id
        })
            .fetch({ require: true })
            .then(user => {
                return user.stats()
            })
            .then(result => res.json(result))
            .catch(error => { console.log(error); res.status(500).send(error.message ? error.message : 'Something went wrong') });
    }


}