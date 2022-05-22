const Joi = require('joi');

const { schema: baseSchema } = require('../../base');
const { TASK_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(2).required(),
  type: Joi.string().valid(TASK_EVENT.TASK_ADDED),
  data: Joi.object({
    publicId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    description: Joi.string().regex(/^((?![\[\]]).)*$/s).required(),
    jiraId: Joi.number().required(),
    assignee_public_id: Joi.string().guid({ version: ['uuidv4'] }).required(),
    creator_public_id: Joi.string().guid({ version: ['uuidv4'] }).required()
  })
});

module.exports = { schema };
