const model = require('../../models/index');

const getRole = async (paramUserId) => {
    let role;
    return new Promise(function (data, failed) {
        model.userDetailsModel.findOne({
            attributes: [
                ['type', 'userRole'],
                ['dep_id', 'departmentId']
            ],
            where: {
                'user_id': paramUserId
            }
        })
            .then(result => {
                role = result.dataValues.departmentId == 1 ? 'ROLE_SADMIN' : result.dataValues.userRole;
                data(role)
            })
            .catch(error => failed(error))
    })
}

module.exports = getRole
