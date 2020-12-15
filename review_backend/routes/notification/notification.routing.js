const express = require('express');
const router = express.Router();

const getNotificationList = require('./get_notificationlist.action');
const deleteNotification = require('./delete_notification.action');
const readAllNotification = require('./read_all_notification.action');
const readNotification = require('./read_notification.action');

router.get("/list", getNotificationList);
router.get('/read', readNotification);
router.get('/readall', readAllNotification);
router.delete("/delete", deleteNotification);

module.exports = router;