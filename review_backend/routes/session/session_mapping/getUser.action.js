const model = require('../../../models/index');
const Sequelize = require('sequelize');

const get_user = (request, response, next) => {

    model.userDetailsModel.findAll({
            attributes: ['user_id', [Sequelize.literal("first_name || ' ' || last_name"), 'fullname'],'type']
        })
        .then(result => {
            data = [];
            members = [];
            for (let i = 0; i < result.length; i++) {
                if (result[i].dataValues.type === 'ROLE_SADMIN') {
                    x = {
                        "user_id": result[i].dataValues.user_id,
                        "fullname": result[i].dataValues.fullname,
                        "type" : result[i].dataValues.type
                    }
                    data.push(x);
                }
                if (result[i].dataValues.type === 'ROLE_MEMBER') {
                    member = {
                        "user_id": result[i].dataValues.user_id,
                        "fullname": result[i].dataValues.fullname,
                        "type" : result[i].dataValues.type
                    }
                    members.push(member);
                }
            }
            response.status(200).json(Object.assign({}, [data,members]));
        })
        .catch((error) => {
            next(error);
        })
}

module.exports = get_user;