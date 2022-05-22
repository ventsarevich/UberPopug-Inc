const Joi = require('joi');

const { ROLE } = require('../../../constants/role');
const { schema: baseSchema } = require('../../base');
const { USER_EVENT } = require('../../../constants/event');

const schema = baseSchema.keys({
  version: Joi.number().valid(1).required(),
  type: Joi.string().valid(USER_EVENT.USER_CREATED),
  data: Joi.object({
    publicId: Joi.string().guid({ version: ['uuidv4'] }).required(),
    role: Joi.string().valid(...Object.values(ROLE)).required(),
    email: Joi.string().email().required(),
    username: Joi.string().required()
  })
});

module.exports = { schema };
