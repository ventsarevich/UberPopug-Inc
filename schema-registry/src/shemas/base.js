const Joi = require('joi');

const schema = Joi.object({
  id: Joi.string().guid({ version: ['uuidv4'] }).required(),
  producer: Joi.string().required(),
  time: Joi.date().required()
});

module.exports = { schema };
