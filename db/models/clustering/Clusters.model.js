const Bookshelf = require('../../../config/bookshelf');
const Workspaces = require('../Workspaces.model');
const { Documents } = require('../filesTypes');


module.exports = Bookshelf.model('Clusters', Bookshelf.Model.extend({
  tableName: 'clusters',
  hasTimestamps: true,
  centroid: function () {
    return this.belongsTo('Documents');
  },
  workspace() {
    return this.belongsTo('Workspaces');
  },
  virtuals: {
    // students_count: function () {
    //   return this.related('students').length;
    // },
    // groups_count: function () {
    //   return this.related('groups').length;
    // },
    // courses_count: function () {
    //   return this.related('courses').length;
    // }
  }

}));
