const IronMq = require('./IronMq');


module.exports = {
    IronMqService: new IronMq(),
    Passport: require('./passport'),
    EmailService: require('./email.service'),
    S3Service: require('./s3.service')

} 