const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').template_id_schema;

var get_template_by_id = function (request, response, next) {
    validator(request.params, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let status_array = ['unused', 'used', 'deleted', 'draft'];
            model.templateModel.findOne({
                attributes: [['t_id', 'templateId'], ['t_status', 'templateStatus'], ['t_description', 'templateDescription'], ['t_name', 'templateName'], ['t_structure', 'templateStructure']],
                where: { t_status: { $ne: 3 }, t_id: request.params.template_id }
            })
                .then(result => {
                    response.status(200).json({
                        'templateId': result.dataValues.templateId,
                        'templateStatus': status_array[result.dataValues.templateStatus - 1],
                        'templateDescription': result.dataValues.templateDescription,
                        'templateName': result.dataValues.templateName,
                        'templateStructure': result.dataValues.templateStructure,
                    });
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_template_by_id;