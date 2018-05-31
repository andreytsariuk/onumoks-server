const Bookshelf = require('../../../config/bookshelf');
const Workspaces = require('../Workspaces.model');
const { Lectors } = require('../rolesTypes');


module.exports = Bookshelf.model('Knowledges', Bookshelf.Model.extend({
  tableName: 'knowledges',
  hasTimestamps: true,
  lectors() {
    return this.belongsToMany('Lectors').through('LectorsKnowledges');
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
