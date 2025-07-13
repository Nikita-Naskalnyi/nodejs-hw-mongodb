import Joi from 'joi';

const resetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export default resetEmailSchema;
