const Joi = require('joi');

const { schema: baseSchema } = require('../../base');
const { TASK_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(TASK_EVENT.TASK_UPDATED),
  data: Joi.object({
    publicId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    assignee_public_id: Joi.string().guid({ version: ['uuidv4'] }),
    description: Joi.string()
  })
});

module.exports = { schema };
