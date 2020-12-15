const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').session_id_schema;

var get_sessionbyid = function (request, response, next) {
    let status_array = ['active', 'inactive', 'deleted'];
    validator(request.params, schema, function (error, value) {
        if (error) {
            next(error);
        } else {
            model.sessionModel.findOne({
                attributes: [
                    ['s_id', 'session_id'],
                    ['s_name', 'session_name'],
                    ['s_frequency', 'review_cycle_frequency'],
                    ['s_starting_date', 'session_starting_date'],
                    ['s_ending_date', 'session_ending_date'],
                    ['s_description', 'session_description'],
                    ['s_status', 'session_status'],
                    ['s_version', 'version']
                ],
                where: {
                    s_id: request.params.session_id
                }
            })
                .then(result => {
                    if (result !== null) {
                        result.dataValues.session_status = status_array[result.dataValues.session_status - 1];
                        response.status(200).json(result);
                    } else {
                        let error = new Error();
                        error.code = 'INVALIDID';
                        next(error);
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_sessionbyid;