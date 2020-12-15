const { templateModel } = require('../models/index');

const templateNameValidator = async (templateName, templateId) => {
    return new Promise(function (data, failed) {        
        templateModel.count({
                where: {
                    t_name: {
                        $eq : templateName
                    },
                    t_id: {
                        $ne: templateId
                    },
                    t_status:{
                        $ne: 3
                    }
                }
            })
            .then(result => data(result!=0))
            .catch(error => failed(error))
    })
}

module.exports = templateNameValidator;