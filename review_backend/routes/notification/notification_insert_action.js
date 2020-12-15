const model = require('../../models/index');

const insertNotificationToDb = (notificationListData) => {
    model.notificationDetailModel.bulkCreate(notificationListData);
};

module.exports = insertNotificationToDb