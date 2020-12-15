const model = require('../../models/index');

const getRevieweeByMapping = async (paramMappingId) => {  
    return new Promise(function (data, failed) {
        model.stmModel.findOne({
            attributes: [
                ['stm_reviewee_id', 'revieweeId'],
            ],
            where: { 'stm_id': paramMappingId }
        })
        .then(result=> data(result.dataValues.revieweeId))
        .catch(error=> failed(error))
    })
}

module.exports = getRevieweeByMapping