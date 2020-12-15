const model = require('../../models/index');

const getTemplateName = async (paramTemplateId) => {
    return new Promise(function (data, failed) {
        model.templateModel.findOne({
            attributes: [['t_name', 'template_name']],
            where: { 't_id': paramTemplateId }
        })
            .then(result => data(result.dataValues.template_name))
            .catch(error => failed(error))
    })
}
module.exports = getTemplateName;