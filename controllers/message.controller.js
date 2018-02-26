
// const { IronMqService } = require('../services');
// const { Message } = require('../models');
// const _ = require('lodash');
// const { RequireFilter } = require('../filters');
// const Bookshelf = require('../config/bookshelf');

// const requireFields = {
//     Post: ['message_body', 'email'],
//     Het: ['id']
// }

// module.exports = class {

//     static Get(req, res) {

//     }
//     static Post(req, res) {
//         if (!RequireFilter.Check(req.body, requireFields.Post))
//             res.status(409).send('Conflict')

//         new Message({
//             status: 'saved',
//             email: _.get(req.body, 'email'),
//             message_body: _.get(req.body, 'message_body'),
//             user_id: req.user.id,
//         })
//             .save()
//             .then(message => {
//                 console.log('message', message.toJSON())
//                 return IronMqService
//                     .sendMessage({
//                         id: message.id
//                     });

//             })
//             .then(result => res.end())
//             .catch(error =>{console.log(error); res.status(500).send(error.message ? error.message : 'Something went wrong')});

//     }
//     static Put() {

//     }
//     static Delete() {

//     }
//     static List() {

//     }


// }