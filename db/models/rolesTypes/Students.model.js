const Bookshelf = require('../../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Roles = require('../Roles.model');
const Users = require('../Users.model');
const Specialties = require('../Specialties.model');
const Courses = require('../Courses.model');
const Groups = require('../Groups.model');



module.exports = Bookshelf.model('Students', Bookshelf.Model.extend({
    tableName: 'students',
    user: function () {
        return this.belongsTo('Users');
    },
    role() {
        return this.morphOne('Roles', 'role');
    },
    specialty: function () {
        return this.belongsTo('Specialties');
    },
    course() {
        return this.belongsTo('Courses');
    },
    groups() {
        return this.belongsToMany('Groups');
    },
    virtuals: {
        short_groups: function () {
            return this.related('groups').map(role => role.get('title'));
        }
    }
}));
