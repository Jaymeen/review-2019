const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').notificationReadAllSchema;

const readAllNotification = (request, response, next) => {
    validator(request.query, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let queryUserId = request.query.userId;
            model.notificationDetailModel.update(
                { 'nd_is_seen': true },
                { where: { 'nd_for': queryUserId } }
            )
                .then(result => {
                    if (result[0] === 0) {
                        response.status(200).json({ message: "Invalid user or no notification is there for this user" });
                    }
                    else {
                        response.status(200).json({ message: "marked all notification as seen" });
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = readAllNotification;