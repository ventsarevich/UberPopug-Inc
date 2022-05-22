const { ROLE } = require('../constants/role');
const taskService = require('../services/task');
const userService = require('../services/user');
const auditLogService = require('../services/audit-log');
const { TYPE } = require('../constants/audit-log-type');
const { STATUS } = require('../constants/task-status');

const getHomePage = async (ctx) => {
  const auditLogs = await auditLogService.find({ userId: ctx.session.user._id });
  const tasks = await taskService.find({ _id: auditLogs.map((log) => log.taskId) });

  const result = auditLogs.map((log) => {
    const task = tasks.find((task) => task._id === log.taskId);
    return {
      ...log._doc,
      taskName: task.description,
      taskCost: log.type === TYPE.RECEIPT ? task.cost : task.fee,
      username: ctx.session.user.username
    };
  });

  const user = await userService.findOne({ _id: ctx.session.user._id });

  let stats = null;
  if (ctx.session.user.role !== ROLE.USER) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const tasks = await taskService.find({ created_at: { $gt: startOfDay, $lt: endOfDay } });

    stats = tasks.reduce((acc, task) => {
      console.log(task);
      if (task.status === STATUS.COMPLETED) {
        acc += task.cost;
      }
      return acc - task.fee;
    }, 0);
  }

  return ctx.render('user', { logs: result, balance: user.balance, stats: stats });
};

const getAnalytics = async (ctx) => {

};

module.exports = { getHomePage };
