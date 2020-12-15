const { secondaryReviewerModel } = require('../../models/index')
const getSecondaryReviewersList = async (stmId) => {
    return new Promise(function (data, failed) {
        secondaryReviewerModel.findAll({
                where: {
                    sr_stm_id: stmId
                }
            })
            .then(result => {
                let reviewerId = [];
                result.forEach(row => {
                    reviewerId.push(row.dataValues.sr_reviewer_id)
                })
                data(reviewerId)
            })
            .catch(error => failed(error))
    })
}

module.exports = getSecondaryReviewersList;
