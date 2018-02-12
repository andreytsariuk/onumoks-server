const Router = require('express').Router;
const _ = require('lodash');
const { SubjectController } = require('../../controllers');



let SubjectRouter = Router();
SubjectRouter.param('subject', function (req, res, next, id) {
  // return new Organization({ id: id }).fetch({ require: true })
  //   .then(function (users) {
  //     req.users = users;
  //     return next();
  //   }).catch(function (error) {
  //     if (error instanceof Organization.NotFoundError)
  //       return res.status(404).json({
  //         error: 'Organization ' + id + ' not found'
  //       });
  //     return res.status(500).json({
  //       error: error
  //     });
  //   })
  return next();
});
SubjectRouter.get('/', SubjectController.List);
SubjectRouter.post('/', SubjectController.Post);
SubjectRouter.put('/:id', SubjectController.Put);
//SubjectRouter.get('/:users', UserController.Get);



module.exports = SubjectRouter;
