const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').delete_template_schema;
const getTemplateName = require('../notification/fetch_template_name');
const notification = require('../notification/notification_insert_function');

const get_total_templates = (request, response, next) => {
    validator(request.query, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let date = Date.now();
            model.templateModel.update(
                { t_status: 3, modified_by: request.query.userId, modified_at: date },
                { where: { t_status: { $ne: 2 }, t_id: request.query.templateId } }
            )
                .then(result => {
                    response.status(200).json({ message: "successfully deleted" });
                    getTemplateName(Number(request.query.templateId)).then(templateName => {
                        let notificationObject = {
                            "fieldId": request.query.templateId,
                            "fieldName": templateName,
                            "date": date,
                            "userId": request.query.userId
                        };
                        notification(12, notificationObject);

                    })
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_total_templates;