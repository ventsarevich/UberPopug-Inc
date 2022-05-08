const Router = require('koa-router');

const taskController = require('../controllers/task');

const router = new Router();

router.get('/home', taskController.getTasks);
router.redirect('/', '/home');

router.post('/tasks/update', taskController.updateTask);
router.post('/tasks/create', taskController.createTask);
router.post('/tasks/shuffle', taskController.shuffleTask);
router.post('/tasks/complete', taskController.completeTask);

module.exports = router;