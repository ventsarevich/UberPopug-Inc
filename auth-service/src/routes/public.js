const Router = require('koa-router');

const authController = require('../controllers/auth');
const userController = require('../controllers/user');

const router = new Router();

router.get('/sso/login', authController.checkLogin);
router.post('/sso/login', authController.login);

router.get('/sso/signup', authController.signUp);
router.post('/sso/signup', userController.createUser);

router.post('/sso/verify', authController.verify);

module.exports = router;