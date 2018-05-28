const Bookshelf = require('../../config/bookshelf');
const Courses = require('./Courses.model');
const { Students } = require('./rolesTypes');
const Workspaces = require('./Workspaces.model');

module.exports = Bookshelf.model('Groups', Bookshelf.Model.extend({
    tableName: 'groups',
    hasTimestamps: true,
    course: function () {
        return this.belongsTo('Courses');
    },
    students() {
        return this.belongsTo('Students');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },
    virtuals: {
        students_count: function () {
            this.related('students').length;
        }
    }

}));
