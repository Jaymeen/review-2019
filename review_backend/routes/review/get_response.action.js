const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').mapping_id_schema;

const get_response = (request, response, next) => {
    validator(request.params, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            model.reviewModel.findOne({
                    attributes: [['r_ans_data', 'response']],
                    where: {
                        'r_stm_id': request.params.mappingId
                    }
            })
                .then(result => {
                    if (!result) {
                        let error = new Error();
                        error.code = 'NORECORD';
                        next(error);
                    }
                    else {
                        response.status(200).json(result);
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_response;