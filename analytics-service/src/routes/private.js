const Router = require('koa-router');

const analyticsController = require('../controllers/analytics');

const router = new Router();

router.get('/home', analyticsController.getHomePage);
router.redirect('/', '/home');

module.exports = router;
