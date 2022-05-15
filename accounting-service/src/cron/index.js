const cron = require('node-cron');

const userService = require('../services/user');
const auditLogService = require('../services/audit-log');
const { STATUS } = require('../constants/task-status');

cron.schedule('0 0 * * *', async () => {
  const userIds = await userService.distinct('_id', { balance: { $gt: 0 } });

  await Promise.all(userIds.map(async (userId) => {
    console.log('EMAIL TO USER IS SENT');
    console.log('BALANCE HAS PAYED');

    await auditLogService.update({ userId: userId }, { status: STATUS.COMPLETED });
    await userService.update({ _id: userId }, { balance: 0 });
  }));
});

module.exports = cron;
