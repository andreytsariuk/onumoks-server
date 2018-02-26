const Bookshelf = require('../../config/bookshelf');
const Promise = require('bluebird');

module.exports = Bookshelf.model('Workspaces', Bookshelf.Model.extend({
    tableName: 'workspaces',
    hasTimestamps: true,
    hidden: [],
    avatar: function () {
        return this.belongsTo('Avatars');
    }
}));
