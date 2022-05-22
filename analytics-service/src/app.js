const Koa = require('koa');
const path = require('path');
const render = require('koa-ejs');
const logger = require('koa-logger');
const error = require('koa-error-ejs');
const koaSession = require('koa-session');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const privateRoutes = require('./routes/private');
const initMongo = require('./database/mongo-connection');
const isAuthenticated = require('./routes/middlewares/authetication');
const verifyAccessToken = require('./routes/middlewares/access-token');
const { init: initConsumer } = require('./queue/consumer');


const app = new Koa();

initMongo();
initConsumer().then(() => console.log('Kafka consumer connected successfully'));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'ejs',
  cache: false,
  debug: true
});

app.keys = [config.SESSION_SECRET];
app
  .use(koaSession({}, app))
  .use(error({
    view: 'errors/default',
    layout: 'layout',
    custom: {
      404: 'errors/not-found',
      403: 'errors/access-denied'
    }
  }))
  .use(logger())
  .use(bodyParser())
  .use(verifyAccessToken)
  .use(isAuthenticated)
  .use(privateRoutes.routes())
  .listen(config.PORT, '0.0.0.0', () => console.log(`listening on http://localhost:${config.PORT}...`));
