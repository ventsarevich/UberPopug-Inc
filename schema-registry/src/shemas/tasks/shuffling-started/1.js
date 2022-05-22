const Joi = require('joi');

const { schema: baseSchema } = require('../../base');
const { TASK_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(TASK_EVENT.TASK_SHUFFLING_STARTED),
  data: Joi.object({
    emitter: Joi.string().required()
  })
});

module.exports = { schema };
