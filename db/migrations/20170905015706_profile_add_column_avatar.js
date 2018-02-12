
exports.up = function (knex, Promise) {
    return knex.schema.table('profiles', function (t) {
        t.string('avatar');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema
        .table('profiles', function (t) {
            t.dropColumn('avatar');
        });
};
