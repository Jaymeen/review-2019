const { userDetailsModel } = require('../models/index');
const sequelize = require('sequelize');

function getAdminEmail(callback) {
    userDetailsModel.findAll({
        attributes: ['email_address', [sequelize.literal("first_name || ' ' || last_name"), 'name']],
        where: {
            $or: [
                {'type': "ROLE_SADMIN"},
                {'dep_id': 1}
            ]
        }
    })
        .then(result => {
            let recipients = [];
            result.forEach(element => {
                recipients.push({
                    "name": element.dataValues.name,
                    "email": element.dataValues.email_address
                });
            });
            return callback(null, recipients);
        })
        .catch(error => {
            return callback(error);
        });
}

module.exports = getAdminEmail;