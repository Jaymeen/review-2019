const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').notificationReadDeleteSchema;

const readNotification = (request, response, next) => {
    validator(request.query, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let queryNotificationId = request.query.notificationId;
            model.notificationDetailModel.update(
                { 'nd_is_seen': true },
                { where: { 'nd_id': queryNotificationId } }
            )
                .then(result => {
                    if (result[0] === 0) {
                        response.status(200).json({ message: "notification not found" });
                    }
                    else {
                        response.status(200).json({ message: "marked notification as seen" });
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = readNotification;