const Joi = require('joi');

const { schema: baseSchema } = require('../../base');
const { PRICE_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(PRICE_EVENT.PRICE_CREATED),
  data: Joi.object({
    taskPublicId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    cost: Joi.number().required(),
    fee: Joi.number().required()
  })
});

module.exports = { schema };
