const model = require('../../models/index');
const getNotificationCount = async (paramUserId) => {
    return new Promise(function (data, failed) {
        model.notificationDetailModel.count({
            attributes: [
                ['nd_for', 'notificationCount']
            ],
            where: { 'nd_for': paramUserId, 'nd_is_seen': false },
            group: ['nd_for']
        })
            .then(result => {
                if (result.length > 0) {
                    data(result[0].count);
                } else {
                    data(0);
                }
            })
            .catch(error => failed(error))
    })
}

module.exports = getNotificationCount;