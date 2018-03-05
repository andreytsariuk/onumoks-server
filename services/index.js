const IronMq = require('./IronMq');


module.exports = {
    IronMqService: new IronMq(),
    Passport: require('./passport'),
    EmailService: require('./email.service')
} 