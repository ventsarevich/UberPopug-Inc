const { ROLE } = require('../constants/role');
const userService = require('../services/user');
const taskService = require('../services/task');
const { STATUS } = require('../constants/task-status');

const getHomePage = async (ctx) => {
  let stats = null;
  let mostExpensiveTask = null;
  if (ctx.session.user.role !== ROLE.USER) {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);

    const tasks = await taskService.find({ created_at: { $gt: startOfDay, $lt: endOfDay } });

    stats = tasks.reduce((acc, task) => {
      if (task.status === STATUS.COMPLETED) {
        acc += task.cost;
        if (!mostExpensiveTask || mostExpensiveTask.cost > task.cost) {
          mostExpensiveTask = task;
        }
      }
      return acc - task.fee;
    }, 0);
  }

  const usersWithNegativeBalance = await userService.find({
    balance: { $lt: 0 }
  });

  console.log(usersWithNegativeBalance);

  return ctx.render('user', { usersWithNegativeBalance, mostExpensiveTask, stats });
};

module.exports = { getHomePage };
