const { PATH } = require('./constants/path');

const validateEvent = (event) => {
  const path = PATH[event.type];
  if (!path) return { isValid: false, error: { type: 'Such Event Type is not registered' } };

  try {
    const { schema } = require(`./shemas/${path}/${event.version}`);

    const result = schema.validate(event, { abortEarly: false });

    if (result.error) {
      const error = result.error.details.map((e) => ({ [e.path.join('.')]: e.message }));
      return { isValid: false, error };
    }

    return { isValid: true, error: null };
  } catch (error) {
    return { isValid: false, error: { version: 'Such Event Version is not registered' } };
  }
};

module.exports = { validateEvent };
