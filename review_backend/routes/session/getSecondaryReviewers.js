const model = require('../../models/index');

const getSecondaryReviewers = async (stmId) => {
    return new Promise(function (data, failed) {
        model.secondaryReviewerModel.findAll({
            include: [{
                model: model.userDetailsModel,
                as: 'reviewerNames',
                attributes: [
                    [model.userDetailsModel.sequelize.literal("first_name || ' ' || last_name"), 'full_name']
                ]
            }],
            where: {
                sr_stm_id: stmId
            }
        })
            .then(result => {
                let names = [];
                result.forEach(res => {
                    names.push(res.dataValues.reviewerNames.dataValues.full_name)
                })
                data(names.sort())
            })
            .catch(error => failed(error))
    })
}

const getObjects = async (result) => {
    return new Promise(function (callback) {
        let respo = []
        let count = 0;
        if (result.length == 0) {
            callback(respo);
        }
        result.forEach(value => {
            getSecondaryReviewers(value.stm_id).then(function (data) {
                let obj = {
                    secondaryReviewers: data,
                    reviewer_name: value.reviewer.dataValues.full_name,
                    template_name: value.templates.t_name,
                    reviewee: value.reviewee.dataValues.full_name
                }
                respo.push(obj);
                count++;
                if (result.length == count) {
                    callback(respo);
                }
            });
        })
    })
}
module.exports = {
    getSecondaryReviewers,
    getObjects
}



