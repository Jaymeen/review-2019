const { sessionModel } = require('../../models/index');
const validator = require('../../utils/validation');
const schema_session = require('../../utils/schemas').session_createupdate_schema;
const schema_session_id = require('../../utils/schemas').session_id_schema;
const email = require('../../utils/email');
const getAdminEmail = require('../../utils/getAdminEmail');
const getFrequency = require('./getFrequency');
const fs = require("fs");
const path = require('path');
let modified_date = Date.now();
const notification = require('../notification/notification_insert_function');
const getFormattedDate = require('../../utils/getFormattedDate');

update_session = (request, response, next) => {

    validator(request.params, schema_session_id, function (error, value) {
        if (error) {
            return next(error);
        } else {
            validator(request.body, schema_session, function (error, value) {
                if (error) {
                    return next(error);
                } else {
                    const updates = {
                        s_name: request.body.session_name,
                        s_frequency: request.body.review_cycle_frequency,
                        s_description: request.body.session_description,
                        s_no_of_days: request.body.session_no_of_days,
                        s_ending_date: request.body.session_ending_date,
                        s_starting_date: request.body.session_starting_date,
                        modified_by: request.body.modified_by,
                        modified_at: modified_date
                    };
                    sessionModel.update(updates, {
                        where: {
                            s_id: request.params.session_id
                        }
                    })
                        .then((result) => {
                            response.status(200).json({ "message": "Session updated succesfully !!" });

                            getAdminEmail(function (error, value) {
                                if (error) {
                                    next(error);
                                } else {
                                    let recipients = value;

                                    let filePath = path.join(__dirname, '../..', 'templates', 'emailTemplate.html');
                                    let updateHTML = fs.readFileSync(filePath, 'utf8').toString();
                                    let subject = 'ERS | Session updated !';
                                    let emailBody = "<table><tr><td style='width: 100px; vertical-align: top;'>Name :</td><td><span style='font-weight: 600;'>" + request.body.session_name + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Description :</td><td><span style='font-weight: 600;'>" + request.body.session_description + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Frequency :</td><td><span style='font-weight: 600;'>" + getFrequency(request.body.review_cycle_frequency) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Start date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(request.body.session_starting_date)) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Ending date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(request.body.session_ending_date)) + "</span></td></tr></table>";

                                    let data = {
                                        emailTag: 'Session has been updated !',
                                        bodyTitle: 'Updated session',
                                        emailBody: emailBody
                                    };

                                    emailData = {
                                        data: data,
                                        recipients: recipients,
                                        subject: subject,
                                        html: updateHTML
                                    }

                                    email(emailData);
                                }
                            });

                            let notificationObject = {
                                "fieldId": request.params.session_id,
                                "fieldName": request.body.session_name,
                                "date": modified_date,
                                "userId": parseInt(request.body.modified_by)
                            };
                            notification(2, notificationObject);

                        })
                        .catch(error => {
                            error.code = 'SEQFALSEINSERT';
                            next(error);
                        });
                }
            });
        }
    });
}

module.exports = update_session;