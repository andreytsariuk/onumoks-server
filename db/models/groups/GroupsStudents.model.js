const Bookshelf = require('../../../config/bookshelf');
const { Students } = require('../rolesTypes');
const Groups = require('../Groups.model');


module.exports = Bookshelf.model('GroupsStudents', Bookshelf.Model.extend({
    tableName: 'groups_students',
    hasTimestamps: true,
    student: function () {
        return this.belongsTo('Students');
    },
    group: function () {
        return this.belongsTo('Groups');
    }
}));
