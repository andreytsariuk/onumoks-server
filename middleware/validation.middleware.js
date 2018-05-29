const Promise = require('bluebird');
const { Conflict } = require('../errors').Server;
const Joi = require('joi');
const _ = require('lodash');

module.exports = function Check(schema) {
    return (req, res, next) => {
        if (!req)
            throw new Conflict();
        if (!schema)
            throw new Conflict();


        return Promise
            .map(_.map(schema, (value, key) => key), key => req[key] ?
                Promise.fromCallback(cb => { console.log('key', key); Joi.validate(req[key], schema[key], cb) }) :
                Promise.resolve()
            )
            .then(() => next())
            .catch(next);
    }
}