const Router = require('koa-router');

const instanceController = require('../controllers/instance');
const userController = require('../controllers/user');

const router = new Router();

router.get('/home', instanceController.getInstances);
router.get('/user', userController.getUsers);
router.redirect('/', '/home');

router.post('/instances/update', instanceController.updateInstance);
router.post('/instances/delete', instanceController.deleteInstance);
router.post('/instances/create', instanceController.createInstance);

router.post('/users/update', userController.updateUser);
router.post('/users/delete', userController.deleteUser);

module.exports = router;