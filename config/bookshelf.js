const config = require('config');
const knex = require('knex')(process.env.DATABASE_URL || config.get('Db'));
const bookshelf = require('bookshelf')(knex);

bookshelf
    .plugin('registry')
    .plugin('virtuals')
    .plugin('visibility')
    .plugin('pagination')
    .plugin(require('bookshelf-soft-delete'));




module.exports = bookshelf;
