const _ = require('lodash');
const Promise = require('bluebird');
const { Conflict } = require('../errors').Server;

module.exports = class {
    static Check(req, schema) {

        if (!req)
            throw new Conflict();
        if (!schema)
            throw new Conflict();

        return Promise
            .map(schema, (value, key) => req[key] && schema[key] ?
                Promise.fromCallback(cb => Joi.validate(req[key], schema[key], cb)) :
                Promise.resolve()
            );
    }
}