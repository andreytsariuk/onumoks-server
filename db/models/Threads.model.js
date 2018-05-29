const Bookshelf = require('../../config/bookshelf');
const Workspaces = require('./Workspaces.model');
const Groups = require('./Groups.model');
const Courses = require('./Courses.model');
const { Students } = require('./rolesTypes');
const { ThreadsCourses, ThreadsGroups, ThreadsStudents } = require('./threads');


module.exports = Bookshelf.model('Threads', Bookshelf.Model.extend({
    tableName: 'threads',
    hasTimestamps: true,
    courses: function () {
        return this.belongsToMany('Courses').through('ThreadsCourses');
    },
    groups: function () {
        return this.belongsToMany('Groups').through('ThreadsGroups');
    },
    students() {
        return this.belongsToMany('Students').through('ThreadsStudents');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },
    virtuals: {
        students_count: function () {
            return this.related('students').length;
        },
        groups_count: function () {
            return this.related('groups').length;
        },
        courses_count: function () {
            return this.related('courses').length;
        }
    }

}));
