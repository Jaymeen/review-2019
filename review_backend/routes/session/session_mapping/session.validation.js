const Joi = require('joi');

var session_mappingdetails_schema = Joi.array().items(Joi.object().keys({
    primaryReviewer: Joi.object().keys({
        reviewer_id: Joi.number().integer().required(),
        reviewer_name: Joi.string().optional()
    }),
    secondaryReviewers: Joi.array().items(Joi.object().keys({
         reviewer_id: Joi.number().integer().optional(),
         reviewer_name: Joi.string().optional()
     })),
    template: Joi.object().keys({
        template_id: Joi.number().integer().required(),
        template_name: Joi.string().optional()
    }),
    reviewees: Joi.array().items(Joi.object().keys({
        reviewee_id: Joi.number().integer().required(),
        reviewee_name: Joi.string().optional()
    })),
}));

module.exports = {
    session_mappingdetails_schema
};