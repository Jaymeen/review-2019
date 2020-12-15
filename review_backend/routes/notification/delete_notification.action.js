const model = require('../../models/index');
const validator = require('../../utils/validation');
const {notificationReadDeleteSchema} = require('../../utils/schemas');

const deleteNotification = (request, response, next) => {
    validator(request.query, notificationReadDeleteSchema, (error, value) => {
        if (error) {
            next(error)
        }
        else {
            let queryNotificationId = request.query.notificationId;
            model.notificationDetailModel.destroy(
                {
                    where: { 'nd_id': queryNotificationId }
                })
                .then(result => {
                    response.status(200).json({ message: "Notification Deleted" });
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = deleteNotification