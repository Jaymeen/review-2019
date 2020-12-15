const getUserName = require('./fetch_user_name');
const getAdminList = require('./fetch_admin_list');
const sendNotification = require('./notification_insert_action');
const getRole = require('./fetch_role');
const getReviewerByMapping = require('./fetch_reviewer_id_by_mapping_id');
const getRevieweeByMapping = require('./fetch_reviewee_id_by_mapping_id');
const getUserData = require('../../utils/getUserData');

const notificationInsert = (type, paramData) => {

    let notificationType = type;
    let userName;
    let userId;
    let modeMessage = ['Created', 'Updated', 'Deleted'];

    if (notificationType >= 1 && notificationType <= 3) {
        userId = parseInt(paramData.userId);
        getUserName(userId).then(data => {
            userName = data;
            getAdminList(userId).then(data => {
                let notificationList = [];
                data.forEach(element => {
                    notificationList.push({
                        "nd_type": notificationType,
                        "created_at": paramData.date,
                        "nd_for": Number(element),
                        "nd_ref": "/list-sessions",
                        "nd_message": `${userName} ${modeMessage[notificationType - 1]} Session ${paramData.fieldName}`,
                        "nd_header": `Session ${modeMessage[notificationType - 1]}`
                    })
                });
                sendNotification(notificationList);
            })
        })
    }

    else if (notificationType >= 10 && notificationType <= 12) {
        tempNotificationId = notificationType - 9;
        userId = parseInt(paramData.userId);
        getUserName(userId).then(data => {
            userName = data;
            getAdminList(userId).then(data => {
                let notificationList = [];
                data.forEach(element => {
                    notificationList.push({
                        "nd_type": notificationType,
                        "created_at": paramData.date,
                        "nd_for": Number(element),
                        "nd_ref": "/list-templates",
                        "nd_message": `${userName} ${modeMessage[tempNotificationId - 1]} Template ${paramData.fieldName}`,
                        "nd_header": `Template ${modeMessage[tempNotificationId - 1]}`
                    })
                });
                sendNotification(notificationList);
            })
        })
    }

    else if (notificationType == 4) {
        let notificationList = [];
        let date = Date.now();
        paramData.forEach(element => {
            getUserName(element.revieweeId).then(revieweeName => {
                let ReviewerNames = "";
                getUserData(element.reviewerId).then(reviewerList => {
                    reviewerList.forEach(name => {
                        ReviewerNames = ReviewerNames + ", " + name.name;
                    });
                }).then(data => {
                    notificationList.push({
                        "nd_type": 6,
                        "created_at": date,
                        "nd_for": element.revieweeId,
                        "nd_ref": '/dashboard',
                        "nd_message": `Your review will be given by ${ReviewerNames.slice(2)}.`,
                        "nd_header": `Review Initiated`
                    });
                }).then(nullData => {
                    element.reviewerId.forEach(data => {
                        getRole(data).then(reviewerRole => {
                            let reviewerRedirection = reviewerRole == 'ROLE_SADMIN' ? '/givereview' : '/dashboard';
                            notificationList.push({
                                "nd_type": notificationType,
                                "created_at": date,
                                "nd_for": data,
                                "nd_ref": reviewerRedirection,
                                "nd_message": `You have been assigned as Reviewer to review ${revieweeName}.`,
                                "nd_header": `Review Scheduled`
                            });
                            sendNotification(notificationList);
                            notificationList = [];
                        })
                    });
                })
            })
        });
    }

    else if (notificationType == 9) {
        getUserName(paramData.createdBy).then(name => {
            getRole(paramData.createdBy).then(role => {
                if (role != 'ROLE_SADMIN') {
                    getAdminList(paramData.createdBy).then(data => {
                        let notificationList = [];
                        data.forEach(element => {
                            notificationList.push({
                                "nd_type": notificationType,
                                "created_at": paramData.date,
                                "nd_for": Number(element),
                                "nd_ref": `/response/${paramData.mappingId}`,
                                "nd_message": `${name} has commented on a review`,
                                "nd_header": `Comment on review`
                            })
                        });
                        sendNotification(notificationList);
                    })
                }
                else {
                    let notificationData = [];
                    getReviewerByMapping(paramData.mappingId).then(mappingReviewerId => {
                        if (mappingReviewerId != paramData.createdBy) {
                            notificationData.push({
                                "nd_type": notificationType,
                                "created_at": paramData.date,
                                "nd_for": mappingReviewerId,
                                "nd_ref": `/myreview/${paramData.mappingId}`,
                                "nd_message": `${name} has commented on a review submitted by you`,
                                "nd_header": `Comment on review`
                            })
                            sendNotification(notificationData);
                        }
                    })
                }
            })
        })
    }

    else if (notificationType == 8) {
        getUserName(paramData.createdBy).then(userName => {
            getAdminList(paramData.createdBy).then(list => {
                getRevieweeByMapping(paramData.mappingId).then(revieweeId => {
                    getUserName(revieweeId).then(revieweeName => {
                        let notificationList = [];
                        list.forEach(element => {
                            notificationList.push({
                                "nd_type": notificationType,
                                "created_at": paramData.date,
                                "nd_for": Number(element),
                                "nd_ref": `/response/${paramData.mappingId}`,
                                "nd_message": `${userName} has submitted a review of ${revieweeName}`,
                                "nd_header": `Review submitted`
                            })
                        });
                        sendNotification(notificationList);
                    })
                })
            })
        })
    }

    else if (notificationType == 7) {
        let notificationList = [];
        getReviewerByMapping(paramData.mappingId).then(reviewerId => {
            getRevieweeByMapping(paramData.mappingId).then(revieweeId => {
                getUserName(revieweeId).then(revieweeName => {
                    getUserName(reviewerId).then(reviewerName => {
                        notificationList.push({
                            "nd_type": 5,
                            "created_at": paramData.date,
                            "nd_for": reviewerId,
                            "nd_ref": `/myreview/${paramData.mappingId}`,
                            "nd_message": `Your Review for ${revieweeName} has been approved`,
                            "nd_header": `Review approved`
                        });
                        notificationList.push({
                            "nd_type": notificationType,
                            "created_at": paramData.date,
                            "nd_for": revieweeId,
                            "nd_ref": `/myreview/${paramData.mappingId}`,
                            "nd_message": `Your Review given by ${reviewerName} has been published`,
                            "nd_header": `Review published`
                        });
                        sendNotification(notificationList);
                    })
                })

            })
        })
    }

    else {
        next(error);
    }
}

module.exports = notificationInsert;