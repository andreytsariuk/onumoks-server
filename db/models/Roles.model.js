const Bookshelf = require('../../config/bookshelf');

const Users = require('./Users.model');
const { Lectors, Admins, Students } = require('./rolesTypes')


module.exports = Bookshelf.model('Roles', Bookshelf.Model.extend({
    tableName: 'roles',
    hasTimestamps: true,
    // visible: ['name'],
    users: function () {
        return this.belongsTo('Users');
    },
    roleType: function () {
        return this.morphTo('role', 'Students', 'Admins', 'Lectors');
    }
}));
