const { userDetailsModel } = require('../models/index');
const sequelize = require('sequelize');

const getUserData = async (userId) => {
    return new Promise(function (data, failed) {
        userDetailsModel.findAll({
            attributes: [
                [sequelize.literal("first_name || ' ' || last_name"), 'name'],
                'email_address'
            ],
            where: {
                'user_id': { $in: userId },
            }
        })
            .then(result => {
                let userData = [];
                result.forEach(element => {
                    userData.push({
                        name: element.dataValues.name,
                        email: element.dataValues.email_address
                    })
                });
                data(userData);
            })
            .catch(
                error => failed(error)
            )
    })
}

module.exports = getUserData;



