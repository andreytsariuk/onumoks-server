//const UnauthorizedException = require('../../errors/exceptions').UnauthorizedException;
const { User } = require('../db/models');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');


module.exports = function authorize(req, res, next) {
    console.log('req.headers', req.headers)


    let token = req.body.token || req.query.access_token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.get('secret'), function (err, decoded) {
            if (err) {
                res.status(401).send('Unauthorize: Token is invalid');
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else
        return res.status(401).send('Unauthorize');
};
