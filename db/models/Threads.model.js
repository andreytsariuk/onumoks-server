const Bookshelf = require('../../config/bookshelf');
const Workspaces = require('./Workspaces.model');
const Groups = require('./Groups.model');
const Courses = require('./Courses.model');
const { Students } = require('./rolesTypes');



module.exports = Bookshelf.model('Threads', Bookshelf.Model.extend({
    tableName: 'threads',
    hasTimestamps: true,
    course: function () {
        return this.hasMany('Courses');
    },
    groups: function () {
        return this.hasMany('Groups');
    },
    students() {
        return this.hasMany('Students');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },
    virtuals: {
        students_count: function () {
            this.related('students').length;
        },
        groups_count: function () {
            this.related('groups').length;
        },
        courses_count: function () {
            this.related('course').length;
        }
    }

}));
