const model = require('../../../models/index');

const addToSecondary = async (secondaryReviewerData) => {
    return new Promise(function (data, failed) {
        model.secondaryReviewerModel.bulkCreate(secondaryReviewerData)
            .then(result => {
                data(result)
            })
            .catch(error => failed(error))
    })
}

module.exports = addToSecondary



