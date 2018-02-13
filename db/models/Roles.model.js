const Bookshelf = require('../config/bookshelf');

const Users = require('./Users.model');
const {Lectors,Admins,Students} = require('./rolesTypes')


module.exports = Bookshelf.model('Role', Bookshelf.Model.extend({
    tableName: 'roles',
    hasTimestamps: true,
    // visible: ['name'],
    users: function () {
        return this.belongsTo('Users');
    },
    roleType: () => {
        return this.morphTo('role', 'Students', 'Admins', 'Lectors');
    }
}));
