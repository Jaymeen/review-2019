const models = require('../models/index');
const sequalize = require('sequelize');
const path = require('path');
const fs = require("fs");
const email = require('./email');
const getFormattedDate = require('../utils/getFormattedDate');
const _ = require("lodash");

function activateSession() {
    models.sessionModel.findAll({
        attributes: ['s_id', 's_starting_date', 's_version'],
        where: {
            s_starting_date: {
                $lt: (new Date(Date.now() + 864e5)).toISOString(),
                $gt: (new Date(Date.now())).toISOString()
            },
            s_status: 2
        }
    }).then(function (result) {
        let updateIds = [];
        result.forEach((object) => {
            updateIds.push(object.dataValues.s_id);
        });
        if (updateIds.length != 0) {
            models.sessionModel.update({
                s_status: 1,
                s_version: sequalize.literal('s_version+1'),
                s_ending_date: sequalize.literal("s_starting_date + s_no_of_days * interval '1 day'")
            }, {
                    where: {
                        s_id: {
                            $in: updateIds
                        }
                    }
                }).then(() => {

                });
        }
    });
}

function deactivateSession() {
    models.sessionModel.findAll({
        attributes: ['s_id', 's_starting_date'],
        where: {
            s_ending_date: {
                $lt: (new Date(Date.now())).toISOString(),
                $gt: (new Date(Date.now() - 864e5)).toISOString()
            },
            s_status: 1
        }
    }).then(function (result) {
        let updateIds = [];

        result.forEach((object) => {
            updateIds.push(object.dataValues.s_id);
        });
        if (updateIds.length != 0) {
            models.sessionModel.update({
                s_status: 2,
                s_starting_date: sequalize.literal("s_starting_date + s_frequency * interval '1 month'")
            }, {
                    where: {
                        s_id: {
                            $in: updateIds
                        }
                    }
                }).then(() => {

                });
        }
    });
}

function sendMailNotification() {
    models.sessionModel.findAll({
        attributes: ['s_id', 's_ending_date', 's_version'],
        where: {
            s_ending_date: {
                $lt: (new Date(Date.now() - 864e5 * 4)).toISOString(),
                $gt: (new Date(Date.now() - 864e5 * 5)).toISOString()
            },
            s_status: 1
        }
    }).then(function (result) {
        let sessionIds = [];
        sessionIds = _.map(result, 's_id');

        if (sessionIds.length != 0) {
            models.stmModel.findAll({
                attributes: ['stm_session_id', 'stm_reviewer_id'],
                where: {
                    stm_status: 1,
                    stm_session_id: { $in: sessionIds }
                },
                include: [{
                    model: models.userDetailsModel,
                    as: 'reviewer',
                    attributes: [
                        [models.userDetailsModel.sequelize.literal("reviewer.first_name || ' ' || reviewer.last_name"), 'reviewer_name'],
                        ['email_address', 'reviewer_mail']
                    ]
                },
                {
                    model: models.sessionModel,
                    as: 'sessions',
                    attributes: [
                        ['s_name', 'session_name'],
                        ['s_ending_date', 'deadline'],
                    ]
                }],
                group: ['stm_session_id', 'stm_reviewer_id', 'sessions.s_id', 'reviewer.user_id']
            })
                .then(function (result) {
                    _.map(result, function (object) {
                        sendMail({
                            sessionName: object.dataValues.sessions.dataValues.session_name,
                            sessionDeadline: object.dataValues.sessions.dataValues.deadline,
                            name: object.dataValues.reviewer.dataValues.reviewer_name,
                            email: object.dataValues.reviewer.dataValues.reviewer_mail
                        })
                    })
                });
        }
    });
}

function sendMail(mailObject) {
    let filePath = path.join(__dirname, '../', 'templates', 'emailTemplate.html');
    let mappingHTML = fs.readFileSync(filePath, 'utf8').toString();

    let reviewerSubject = 'ERS | Review Pending !';
    let emailBody = "<table><tr><td style='width: 100px; vertical-align: top;'>Name :</td><td><span style='font-weight: 600;'>" + mailObject.sessionName + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Deadline :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(mailObject.sessionDeadline)) + "</span></td></tr></table>";

    let emailData = {
        emailTag: 'Review(s) to be given by you is/are still pending !',
        bodyTitle: 'Review pending',
        emailBody: emailBody
    };

    reviewerEmailData = {
        data: emailData,
        recipients: [mailObject],
        subject: reviewerSubject,
        html: mappingHTML
    }

    email(reviewerEmailData);
}

module.exports = {
    activateSession,
    deactivateSession,
    sendMailNotification
};