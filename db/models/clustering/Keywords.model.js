const Bookshelf = require('../../../config/bookshelf');
const Workspaces = require('../Workspaces.model');


module.exports = Bookshelf.model('Keywords', Bookshelf.Model.extend({
  tableName: 'keywords',
  hasTimestamps: true,
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
