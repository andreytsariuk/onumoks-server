

const Bookshelf = require('../config/bookshelf');


const User = require('./user.model');

module.exports = Bookshelf.model('Statuses', Bookshelf.Model.extend({
    tableName: 'statuses',
    //visible: ['name'],
    users: function () {
        return this.belongsToMany('User');
    }
}));
