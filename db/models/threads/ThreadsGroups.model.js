const Bookshelf = require('../../../config/bookshelf');
const Threads = require('../Threads.model');
const Groups = require('../Groups.model');


module.exports = Bookshelf.model('ThreadsGroups', Bookshelf.Model.extend({
    tableName: 'threads_groups',
    hasTimestamps: true,
    group: function () {
        return this.belongsTo('Groups');
    },
    thread: function () {
        return this.belongsTo('Threads');
    }
}));
