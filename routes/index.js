
const router = require('express').Router();
const config = require('config');
const Api = require('./api');
var path = require("path");
const passport = require('passport');

const { ErrorsMiddleweare, AuthorizeMidddleweare } = require('../middleware');
const { AuthorizeController, UserController } = require('../controllers');
/* GET home page. */


// Api.use(passport.authenticate('jwt', config.get('session')))

router.use('/api', Api);
router.post('/authorize', AuthorizeController.Post);
router.post('/registration', UserController.Registration);
router.post('/authorize/token', AuthorizeController.Verify);

// router.get('*', (req, res) => {
//     return res.sendFile(path.join(__dirname + '/../public/index.html'));
// });
//router.use(allowCrossDomain);
router.use('*', ErrorsMiddleweare);


module.exports = router;
