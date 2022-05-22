const Joi = require('joi');

const { schema: baseSchema } = require('../../base');
const { BALANCE_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(BALANCE_EVENT.BALANCE_UPDATED),
  data: Joi.object({
    userPublicId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    balance: Joi.number().required()
  })
});

module.exports = { schema };
