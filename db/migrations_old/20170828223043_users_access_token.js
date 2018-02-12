
exports.up = function (knex, Promise) {
    return knex.schema.table('users', function (t) {
        t.string('access_token');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('users', function (t) {
            t.dropColumn('access_token');
        });
};
