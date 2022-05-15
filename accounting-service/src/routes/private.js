const Router = require('koa-router');

const auditLogController = require('../controllers/audit-log');

const router = new Router();

router.get('/home', auditLogController.getHomePage);
router.redirect('/', '/home');

module.exports = router;
