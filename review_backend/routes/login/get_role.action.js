const model = require('../../models/index');
const Sequelize = require('sequelize');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').login_email_schema;
let jwt = require('jsonwebtoken');
const config = require('../../utils/config');

const get_role = (request, response, next) => {
    validator(request.params, schema, function (error, value) {
        if (error) {
            next(error);
        } else {
            let token = request.header('authorization');

            if (token && token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
            }
            if (token) {
                jwt.verify(token, config.secret, (error, decoded) => {
                    if (error) {
                        error.code = 'JWTFALSE';
                        next(error);
                    } else {
                        generateResponse();
                    }
                });
            }
            else {
                generateResponse();
            }

            function generateResponse()
            {
                model.userDetailsModel.findOne({
                    where: {
                        email_address: request.params.email,
                        is_active: 'true'
                    },
                    attributes: ['user_id','dep_id', [Sequelize.literal("first_name || ' ' || last_name"), 'fullname'], 'type', 'is_active'],
                    include: [{
                        model: model.designationModel,
                        required: true,
                        attributes: ['des_name']
                    }]
                })
                    .then(result => {
                        if (result !== null) {
                            if (!token) {
                                token = jwt.sign({
                                    Email: request.params.email
                                },
                                    config.secret, {
                                        expiresIn: '1d'
                                    }
                                );
                            }
                            response.status(200).json({
                                "user_id": result.user_id,
                                "full_name": result.dataValues.fullname,
                                "role": result.dataValues.dep_id==1?'ROLE_SADMIN':result.type,
                                "active_status": result.is_active,
                                "designation": result.designation.des_name,
                                "token": token
                            });
                        } else {
                            let error = new Error();
                            error.code = 'LOGINFALSE';
                            next(error);
                        }
                    })
                    .catch((error) => {
                        next(error);
                    });
            
            }
        }
    });
};


module.exports = get_role;