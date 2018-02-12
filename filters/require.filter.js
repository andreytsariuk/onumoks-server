const _ = require('lodash');
const Promise = require('bluebird');
const { Conflict } = require('../errors').Server;

module.exports = class {
    static Check(object, requiredFields) {
        return new Promise((resolve, reject) => {
            if (!object)
                throw new Conflict();
            if (!requiredFields)
                throw new Conflict();
            let allFieldsExists = object;

            requiredFields.forEach((field) => {
                let getedField = _.get(object, field);
                if (!getedField) {
                    allFieldsExists = false;
                }
            });

            if (!allFieldsExists) {
                throw new Conflict();
            }
            
            return resolve(allFieldsExists);
        })



    }
}