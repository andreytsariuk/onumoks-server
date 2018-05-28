const Bookshelf = require('../../../config/bookshelf');
const Threads = require('../Threads.model');
const Courses = require('../Courses.model');


module.exports = Bookshelf.model('ThreadsCourses', Bookshelf.Model.extend({
    tableName: 'threads_courses',
    hasTimestamps: true,
    course: function () {
        return this.belongsTo('Courses');
    },
    thread: function () {
        return this.belongsTo('Threads');
    }
}));
