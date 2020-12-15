const Joi = require('joi');

// Generic Schema Models.

const email_schema = Joi.string().email();
const integer_schema = Joi.number().integer();
const name_schema = Joi.string().regex(/^[\w\- ][\w\- ]*$/i);
const description_schema = Joi.string().regex(/^[\w! \n@$%&*()+\-=\[\]{};':"\\,.<>\/?]*$/i);
const date_schema = Joi.date();
const search_schema = Joi.string();

// Particular Schema Models as required by the APIs.

const login_email_schema = Joi.object().keys({
    email: email_schema.max(200).required()
});

const session_id_schema = Joi.object().keys({
    session_id: integer_schema.required()
});

const delete_session_schema = Joi.object().keys({
    sessionId: integer_schema.required(),
    userId: integer_schema.required()
});

const template_id_schema = Joi.object().keys({
    template_id: integer_schema.required()
});

const delete_template_schema = Joi.object().keys({
    templateId: integer_schema.required(),
    userId: integer_schema.required()
});

const template_list_schema = Joi.object().keys({
    pageSize: integer_schema.allow('').optional(),
    pageIndex: integer_schema.allow('').optional(),
    search: search_schema.allow('').optional(),
    status: name_schema.allow('').optional(),
    sort: name_schema.allow('').optional(),
    order: integer_schema.allow('').optional(),
    sessionStatus: integer_schema.allow('').optional(),
    userId: integer_schema.required()
});

const mapping_list_schema = Joi.object().keys({
    pageSize: integer_schema.allow('').optional(),
    pageIndex: integer_schema.allow('').optional(),
    search: search_schema.allow('').optional(),
    status: name_schema.allow('').optional(),
    sort: name_schema.allow('').optional(),
    order: integer_schema.allow('').optional(),
    sessionStatus: integer_schema.allow('').optional()
});

const session_createupdate_schema = Joi.object().keys({
    session_name: name_schema.max(50).required(),
    review_cycle_frequency: integer_schema.valid(0, 1, 2, 3, 4, 6, 12).required(),
    session_description: description_schema.max(400).allow('').optional(),
    session_starting_date: date_schema.required(),
    session_ending_date: date_schema.required(),
    session_version: integer_schema.allow('').optional(),
    session_no_of_days: integer_schema.required(),
    created_by: integer_schema.allow('').optional(),
    modified_by: integer_schema.allow('').optional()
});

const reviewees_list_schema = Joi.object().keys({
    userId: integer_schema.required(),
    pageSize: integer_schema.allow('').optional(),
    pageIndex: integer_schema.allow('').optional(),
    search: search_schema.allow('').optional(),
    status: name_schema.allow('').optional(),
    sort: name_schema.allow('').optional(),
    order: integer_schema.allow('').optional()
});

const template_insert_update_schema = Joi.object().keys({
    template_name: name_schema.max(50).trim().required(),
    template_structure: Joi.array().items().required(),
    template_description: description_schema.max(400).trim().required(),
    user_id: integer_schema.required(),
    saveAsDraft: Joi.boolean().required()
});

const review_response_schema = Joi.object().keys({
    session_template_mapping_id :integer_schema.required(),
    answer_response: Joi.array().items().required(),
    user_id: integer_schema.allow('').optional(),
    modified_by: integer_schema.allow('').optional() 
});

const review_response_schema_update = Joi.object().keys({
    session_template_mapping_id: integer_schema.required(),
    answer_response: Joi.array().items().required(),
    user_id: integer_schema.allow('').optional(),
    modified_by: integer_schema.allow('').optional(),
    old_data: Joi.array().items().required(),
    question_response: Joi.array().items().required(),
    user_name: name_schema.max(50).trim().required(),
});

const mapping_id_schema = Joi.object().keys({
    mappingId: integer_schema.required()
});

const publish_mapping_schema = Joi.object().keys({
    mappingId: integer_schema.required(),
    userId: integer_schema.required()
});

const comment_id_schema = Joi.object().keys({
    commentId: Joi.array().items().required()
});

const comment_schema = Joi.object().keys({
    mappingId: integer_schema.required(),
    parentId: integer_schema.required(),
    comment: description_schema.required(),
    user: integer_schema.required(),
    commentVisibility: Joi.boolean().required()
});

const notificationListSchema = Joi.object().keys({
    userId: integer_schema.required(),
    flag: name_schema.required()
});

const notificationReadAllSchema = Joi.object().keys({
    userId: integer_schema.required()
});

const notificationReadDeleteSchema = Joi.object().keys({
    notificationId: integer_schema.required()
});

const nameValidationSchema = {
    name: name_schema.required(),
    modelName: name_schema.required(),
    isUpdate: integer_schema.optional()
}

module.exports = {
    login_email_schema,
    session_id_schema,
    template_id_schema,
    template_list_schema,
    session_createupdate_schema,
    mapping_list_schema,
    review_response_schema,
    template_insert_update_schema,
    reviewees_list_schema,
    mapping_id_schema,
    comment_schema,
    comment_id_schema,
    notificationListSchema,
    notificationReadAllSchema,
    notificationReadDeleteSchema,
    publish_mapping_schema,
    delete_template_schema,
    delete_session_schema,
    review_response_schema_update,
    nameValidationSchema
};