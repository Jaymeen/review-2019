const model = require('../../models/index');

const getUserByMapping = async (paramMappingId) => {
    return new Promise(function (data, failed) {
        model.stmModel.findOne({
            attributes: [
                ['stm_reviewer_id', 'reviewerId'],
            ],
            where: { 'stm_id': paramMappingId }
        })
            .then(result => data(result.dataValues.reviewerId))
            .catch(error => failed(error))
    })
}

module.exports = getUserByMapping