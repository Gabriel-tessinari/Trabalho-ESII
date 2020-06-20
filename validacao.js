const joi = require('@hapi/joi');

const registerValidation = (data) => {
    const schema = joi.object({
      name: joi.string().min(6).required(),
      email: joi.string().min(6).required().email(),
      password: joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required(),
    });
    return schema.validate(data);
}

const saveValidation = (data) => {
    const schema = joi.object({
        text: joi.string().required(),
        user: joi.string().required()
    });
    return schema.validate(data);
}

const updateValidation = (data) => {
    const schema = joi.object({
        text: joi.string().required()
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.saveValidation = saveValidation;
module.exports.updateValidation = updateValidation;