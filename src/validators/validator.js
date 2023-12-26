import joi from 'joi';

export const movieDataValidator = joi.object({
  title: joi.string().required(),
  year: joi.number().greater(999).less(3000).required(),
  imgUrl: joi.string().required()
})

export const userDataValidator = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})