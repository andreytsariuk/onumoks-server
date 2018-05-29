const Bookshelf = require('../../config/bookshelf');
const Workspaces = require('./Workspaces.model');
const Groups = require('./Groups.model');
const Courses = require('./Courses.model');
const Subjects = require('./Subjects.model');
const Threads = require('./Threads.model');
const { Lectors } = require('./rolesTypes');
const LessonTypes = require('./LessonTypes.model');


module.exports = Bookshelf.model('LoadItems', Bookshelf.Model.extend({
    tableName: 'load_items',
    hasTimestamps: true,
    course: function () {
        return this.belongsTo('Courses')
    },
    group: function () {
        return this.belongsTo('Groups');
    },
    thread: function () {
        return this.belongsTo('Threads');
    },
    subject() {
        return this.belongsTo('Subjects');
    },
    lector() {
        return this.belongsTo('Lectors');
    },
    lessonType() {
        return this.belongsTo('LessonTypes');
    },
    virtuals: {
        // students_count: function () {
        //     return this.related('students').length;
        // },
        // groups_count: function () {
        //     return this.related('groups').length;
        // },
        // courses_count: function () {
        //     return this.related('courses').length;
        // }
    }

}));
