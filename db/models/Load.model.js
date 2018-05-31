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
            let hours_array = this.related('loadItems').map(model => model.get('hours_count'));
            return _.reduce(hours_array, (sum, n) => sum + parseFloat(n), 0)
        },
        // short_roles: function () {
        //     return this.related('roles').map(role => role.get('role_type'));
        // }
    }

}));
