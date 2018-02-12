const Bookshelf = require('../config/bookshelf');


const User = require('./user.model');

module.exports = Bookshelf.model('Role', Bookshelf.Model.extend({
    tableName: 'roles',
    visible: ['name'],
    users: function () {
        return this.belongsToMany('User');
    }
}));
