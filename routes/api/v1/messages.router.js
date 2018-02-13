const Router = require('express').Router;
const _ = require('lodash');
const { MessageController } = require('../../controllers');



let MessageRouter = Router();
// MessageRouter.param('messages', function (req, res, next, id) {
//     // return new Organization({ id: id }).fetch({ require: true })
//     //   .then(function (users) {
//     //     req.users = users;
//     //     return next();
//     //   }).catch(function (error) {
//     //     if (error instanceof Organization.NotFoundError)
//     //       return res.status(404).json({
//     //         error: 'Organization ' + id + ' not found'
//     //       });
//     //     return res.status(500).json({
//     //       error: error
//     //     });
//     //   })
//     return next();
// });
MessageRouter.get('/', MessageController.List);
MessageRouter.post('/', MessageController.Post);
MessageRouter.put('/:message', MessageController.Put);
MessageRouter.get('/:message', MessageController.Get);
MessageRouter.delete('/:message', MessageController.Delete);




module.exports = MessageRouter;
