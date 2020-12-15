const { sessionModel } = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').session_createupdate_schema;
const email = require('../../utils/email');
const getAdminEmail = require('../../utils/getAdminEmail');
const notification = require('../notification/notification_insert_function');
const getFrequency = require('./getFrequency');
const fs = require("fs");
const path = require('path');
let created_date = Date.now();
const getFormattedDate = require('../../utils/getFormattedDate');
require('dotenv').config();

create_session = (request, response, next) => {
    validator(request.body, schema, function (error, value) {
        if (error) {
            return next(error);
        } else {
            sessionModel.create({
                s_name: request.body.session_name,
                s_frequency: request.body.review_cycle_frequency,
                s_description: request.body.session_description,
                s_version: request.body.session_version,
                s_status: request.body.session_version != 0 ? 1 : 2,
                s_no_of_days: request.body.session_no_of_days,
                s_ending_date: request.body.session_ending_date,
                s_starting_date: request.body.session_starting_date,
                created_by: request.body.created_by,
                created_at: created_date
            })
                .then((result) => {
                    response.status(200).json({ "message": "Session created succesfully !!" });

                    getAdminEmail(function (error, value) {
                        if (error) {
                            next(error);
                        } else {
                            let recipients = value;

                            let filePath = path.join(__dirname, '../..', 'templates', 'emailTemplate.html');
                            let createHTML = fs.readFileSync(filePath, 'utf8').toString();
                            let subject = 'ERS | New Session created !';
                            let emailBody = "<table><tr><td style='width: 100px; vertical-align: top;'>Name :</td><td><span style='font-weight: 600;'>" + request.body.session_name + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Description :</td><td><span style='font-weight: 600;'>" + request.body.session_description + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Frequency :</td><td><span style='font-weight: 600;'>" + getFrequency(request.body.review_cycle_frequency) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Start date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(request.body.session_starting_date)) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Ending date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(request.body.session_ending_date)) + "</span></td></tr></table>";

                            let data = {
                                emailTag: 'New Session has been created !',
                                bodyTitle: 'Created session',
                                emailBody: emailBody
                            };

                            emailData = {
                                data: data,
                                recipients: recipients,
                                subject: subject,
                                html: createHTML
                            }

                            email(emailData);
                        }
                    });

                    let notificationObject = {
                        "fieldId": result.dataValues.s_id,
                        "fieldName": result.dataValues.s_name,
                        "date": result.dataValues.created_at,
                        "userId": result.dataValues.created_by
                    };
                    notification(1, notificationObject);
                })
                .catch(error => {
                    error.code = "SEQFALSEINSERT";
                    next(error);
                });
        }
    });
};

module.exports = create_session;