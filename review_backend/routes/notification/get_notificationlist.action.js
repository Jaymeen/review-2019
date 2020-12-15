const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').notificationListSchema;
const getNotificationCount = require('./fetch_notification_count');

const getNotificationList = (request, response, next) => {
    validator(request.query, schema, (error, value) => {
        if (error) {
            next(error)
        }
        else {
            let queryUserId = request.query.userId;
            let limitNumber = request.query.flag == 'new' ? 10 : 100;

            getNotificationCount(queryUserId).then(length => {
                model.notificationDetailModel.findAll({
                    attributes: [
                        ['nd_id', 'notificationId'],
                        ['nd_type', 'notificationType'],
                        ['nd_is_seen', 'isSeen'],
                        ['created_at', 'creationDate'],
                        ['nd_ref', 'notificationReference'],
                        ['nd_for', 'forUserId'],
                        ['nd_message', 'notificationMessage'],
                        ['nd_header', 'notificationHeader'],
                    ],
                    where: { 'nd_for': queryUserId },
                    order: [['nd_id','desc']],
                    limit: limitNumber
                })
                    .then(result => {
                        let lengthTotal = result.length;
                        let newData = [];
                        result.forEach(element => {
                            newData.push({
                                'notificationId': element.dataValues.notificationId,
                                'isSeen': element.dataValues.isSeen,
                                'timeStamp': element.dataValues.creationDate,
                                'notificationType': element.dataValues.notificationType,
                                'notificationMessage': element.dataValues.notificationMessage,
                                'notificationHeader': element.dataValues.notificationHeader,
                                'notificationReference': element.dataValues.notificationReference
                            });
                        });

                        response.status(200).json(Object.assign({}, [Number(lengthTotal), Number(length), newData]));
                    })
                    .catch((error) => {
                        next(error);
                    })
            })
        }
    })
}

module.exports = getNotificationList;