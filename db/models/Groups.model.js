const Bookshelf = require('../../config/bookshelf');
const Courses = require('./Courses.model');
const { Students } = require('./rolesTypes');
const Workspaces = require('./Workspaces.model');
const { GroupsStudents } = require('./groups');

module.exports = Bookshelf.model('Groups', Bookshelf.Model.extend({
    tableName: 'groups',
    hasTimestamps: true,
    course: function () {
        return this.belongsTo('Courses');
    },
    students() {
        return this.belongsToMany('Students').through('GroupsStudents');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },
    virtuals: {
        students_count: function () {
            return this.related('students').length;
        }
    }

}));
