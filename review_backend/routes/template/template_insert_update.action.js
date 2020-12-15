const models = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').template_insert_update_schema;
const template_id_schema = require('../../utils/schemas').template_id_schema;
let modified_date = Date.now();
const notification = require('../notification/notification_insert_function');

template_insert = (request, response, next) => {

    validator(request.body, schema, (error, value) => {
        if (error) {
            next(error);
        }
        else {
            tName = request.body.template_name;
            structure = request.body.template_structure;
            saveAsDraft = request.body.saveAsDraft;
            tFormat = [];
            structure.forEach((ques, index) => {
                qno = tName + '_' + (index + 1);
                quesformated = {};
                quesformated[qno] = ques;
                tFormat.push(quesformated);
            });

            if (saveAsDraft) {
                t_status = 4;
            } else {
                t_status = 1;
            }

            if (Object.keys(request.query).length === 0) {
                models.templateModel.create({
                    t_name: tName,
                    t_structure: tFormat,
                    t_description: request.body.template_description,
                    t_status: t_status,
                    created_by: request.body.user_id,
                    created_at: Date.now()
                })
                    .then((result) => {
                        response.status(200).json({ value: result.dataValues.t_id, label: result.dataValues.t_name });

                        let notificationObject = {
                            "fieldId": result.dataValues.t_id,
                            "fieldName": result.dataValues.t_name,
                            "date": result.dataValues.created_at,
                            "userId": result.dataValues.created_by
                        };
                        notification(10, notificationObject);
                    }).catch(error => {
                        if (error.errors[0].type === 'unique violation') {
                            error.code = 'UNIQUEVIOLATION';
                        }
                        next(error);
                    });
            } else {
                validator(request.query, template_id_schema, function (error, value) {
                    if (error) {
                        next(error);
                    }
                    else {
                        models.templateModel.findOne({
                            attributes: [['t_id', 'template_id']],
                            where: {
                                t_id: request.query.template_id
                            }
                        })
                            .then(result => {
                                const updates = {
                                    t_name: tName,
                                    t_structure: tFormat,
                                    t_status: t_status,
                                    t_description: request.body.template_description,
                                    modified_by: request.body.user_id,
                                    modified_at: modified_date
                                };
                                models.templateModel.update(updates, {
                                    where: {
                                        t_id: request.query.template_id
                                    }
                                })
                                    .then(() => {
                                        response.status(200).json({ 'message': 'template updated successfully.' });
                                        let notificationObject = {
                                            "fieldId": request.query.template_id,
                                            "fieldName": tName,
                                            "date": modified_date,
                                            "userId": request.body.user_id
                                        };
                                        notification(11, notificationObject);
                                    }).catch(error => {
                                        if (error.errors[0].type === 'unique violation') {
                                            error.code = 'UNIQUEVIOLATION';
                                        } else {
                                            error.code = 'TEMPLATEUPDATEFALSE';
                                        }
                                        next(error);
                                    });
                            })
                            .catch((error) => {
                                next(error);
                            })
                    }
                })
            }
        }
    });
};

module.exports = template_insert;