const Bookshelf = require('../../config/bookshelf');
const knex = Bookshelf.knex;
const Promise = require('bluebird');
const Workspaces = require('./Workspaces.model');
const Lectors = require('./rolesTypes/Lectors.model');


const suid = require('rand-token').suid;

module.exports = Bookshelf.model('Positions', Bookshelf.Model.extend({
    tableName: 'positions',
    hasTimestamps: true,
    lectors() {
        return this.hasMany('Lectors');
    },
    workspace() {
        return this.belongsTo('Workspaces');
    }
    // virtuals: {
    //     studentsCount: function () {
    //         return knex('students').where('workspace_id', this.get('workspace_id')).andWhere('specialty_id', this.id).count()
    //             .then(res => {
    //                 let [{ count }] = res
    //                 return count;
    //             })
    //     }
    // }
}));
