const Bookshelf = require('../../../config/bookshelf');
const { Students } = require('../rolesTypes');
const Threads = require('../Threads.model');


module.exports = Bookshelf.model('ThreadsStudents', Bookshelf.Model.extend({
    tableName: 'threads_students',
    hasTimestamps: true,
    student: function () {
        return this.belongsTo('Students');
    },
    thread: function () {
        return this.belongsTo('Threads');
    }
}));
