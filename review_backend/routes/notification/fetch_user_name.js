const model = require('../../models/index');

const getUserName = async (paramUserId) => {
    return new Promise(function (data, failed) {
        model.userDetailsModel.findOne({
            attributes: [
                ['user_id', 'userId'],
                ['first_name', 'firstName'],
                ['last_name', 'lastName'],
            ],
            where: { 'user_id': paramUserId }
        })
            .then(result => 
                        data(`${result.dataValues.firstName} ${result.dataValues.lastName}`))
                
                .catch(error => failed(error))
    })
}

module.exports = getUserName



