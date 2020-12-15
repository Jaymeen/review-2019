const model = require('../../models/index');
const getAdminList = async (paramUserId) => {
    return new Promise(function (data, failed) {

        model.userDetailsModel.findAll({
            attributes: [
                'user_id'
            ],
            where: {
                'user_id': { $ne: paramUserId },
                $or: [
                    { 'type': "ROLE_SADMIN" },
                    { 'dep_id': 1 }
                ]
            }
        })
            .then(result => {
                let list = [];
                result.forEach(element => {
                    list.push(element.dataValues.user_id)
                });
                data(list);
            })
            .catch(error => failed(error))
    })
}

module.exports = getAdminList