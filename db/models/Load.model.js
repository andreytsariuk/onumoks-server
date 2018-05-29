const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const _ = require('lodash');
const Workspaces = require('./Workspaces.model')
const LoadItems = require('./LoadItems.model');

module.exports = Bookshelf.model('Loads', Bookshelf.Model.extend({
    tableName: 'loads',
    hasTimestamps: true,
    loadItems: function () {
        return this.hasMany('LoadItems');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    },
    virtuals: {
        summ_hours: function () {
            return this.related('loadItems').count('hours_count');
        },
        // short_roles: function () {
        //     return this.related('roles').map(role => role.get('role_type'));
        // }
    }

}));
