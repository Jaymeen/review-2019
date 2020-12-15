const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').mapping_id_schema;

const get_comments = (request, response, next) => {
    validator(request.params, schema, function(error, value) {
        if (error) {
            next(error);
        } else {
            model.commentModel.findAll({
                    attributes: ['c_id', 'c_data', 'c_visible', 'created_at', 'c_parent', 'c_system_generated'],
                    include: [{
                        model: model.userDetailsModel,
                        as: 'createdBy',
                        attributes: [
                            ['first_name', 'user'],
                            ['user_id', 'userId']
                        ]
                    }],
                    where: {
                        'c_stm_id': request.params.mappingId
                    },
                    order: ['c_parent', 'c_id']
                })
                .then(result => {
                    if (!result) {
                        let error = new Error();
                        error.code = 'NORECORD';
                        next(error);
                    } else {
                        data = [];
                        result.forEach(element => {
                            row = {
                                "commentId": element.dataValues.c_id,
                                "parentId": element.dataValues.c_parent,
                                "comment": element.dataValues.c_data,
                                "visibility": element.dataValues.c_visible,
                                "creationTime": element.dataValues.created_at,
                                "sender": element.createdBy.dataValues.user,
                                "senderId": element.createdBy.dataValues.userId,
                                "systemGeneratedFlag": element.dataValues.c_system_generated != 1
                            }
                            data.push(row);
                        });
                        response.status(200).json(data);
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_comments;