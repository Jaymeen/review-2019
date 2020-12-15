const Joi = require('joi');

async function validate(data, schema, callback) {
    await Joi.validate(data, schema, function (error, value) {
        if (error) {
            error.code = "JOIFALSE";
            return callback(error);
        } else {
            return callback(null, value);
        }
    });
}

module.exports = validate;
