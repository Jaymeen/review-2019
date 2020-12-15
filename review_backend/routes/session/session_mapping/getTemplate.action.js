const model = require('../../../models/index');

const get_template = (request, response, next) => {
    model.templateModel.findAll({
        attributes: [
            ['t_id', 'value'],
            ['t_name', 'label']
        ],
        where: {
            t_status: { $ne: 3 }
        }
    })
        .then(result => {
            response.status(200).json(result);
        })
        .catch((error) => {
            next(error);
        })
}

module.exports = get_template;