const models = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').delete_session_schema;
const email = require('../../utils/email');
const getFrequency = require('./getFrequency');
const fs = require("fs");
const path = require('path');
const getAdminEmail = require('../../utils/getAdminEmail');
let deletedSession;
const notification = require('../notification/notification_insert_function');
const getFormattedDate = require('../../utils/getFormattedDate');

const delete_session = (request, response, next) => {
    validator(request.query, schema, function (error, value) {
        if (error) {
            next(error);
        } else {
            let date = Date.now();
            
            const session_id = request.query.sessionId;
            if (session_id !== undefined) {
                const values = {
                    s_status: 3,
                    s_frequency: 0,
                    modified_by: request.query.userId,
                    modified_at: date
                };
                const selector = {
                    where: {
                        s_id: session_id
                    }
                };

                models.sessionModel.findOne({
                    where: {
                        s_id: session_id,
                    }
                })
                    .then(result => {

                        if (result === null) {
                            let error = new Error();
                            error.code = 'SIDNOTFOUND';
                            next(error);
                        }

                        if(result.dataValues.s_status === 1){
                            let error = new Error();
                            error.code = 'SIDACTIVE';
                            next(error);
                        }

                        deletedSession = {
                            sessionName: result.dataValues.s_name,
                            sessionFrequency: result.dataValues.s_frequency,
                            sessionDescription: result.dataValues.s_description,
                            sessionEndingDate: result.dataValues.s_ending_date,
                            sessionStartingDate: result.dataValues.s_starting_date
                        };

                        return result;
                    })
                    .then(result => {
                        return models.stmModel.count({
                            where: {
                                stm_session_id: result.s_id
                            }
                        })
                    })
                    .then(r => {
                        if (r > 0) {
                            let error = new Error();
                            error.code = 'SIDINSTM';
                            next(error);
                        }
                        else {
                            models.sessionModel.update(values, selector)
                                .then(() => {
                                    response.status(200).json({ message: "deletion successful" })

                                    let notificationObject = {
                                        "fieldId": request.query.sessionId,
                                        "fieldName": deletedSession.sessionName,
                                        "date": date,
                                        "userId": request.query.userId
                                    };
                                    notification(3, notificationObject);

                                    getAdminEmail(function (error, value) {
                                        if (error) {
                                            next(error);
                                        } else {
                                            let recipients = value;

                                            let filePath = path.join(__dirname, '../..', 'templates', 'emailTemplate.html');
                                            let deleteHTML = fs.readFileSync(filePath, 'utf8').toString();
                                            let subject = 'ERS | Session deleted !';
                                            let emailBody = "<table><tr><td style='width: 100px; vertical-align: top;'>Name :</td><td><span style='font-weight: 600;'>" + deletedSession.sessionName + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Description :</td><td><span style='font-weight: 600;'>" + deletedSession.sessionDescription + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Frequency :</td><td><span style='font-weight: 600;'>" + getFrequency(deletedSession.sessionFrequency) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Start date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(deletedSession.sessionStartingDate)) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Ending date :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(deletedSession.sessionEndingDate)) + "</span></td></tr></table>";

                                            let data = {
                                                emailTag: 'Session has been deleted !',
                                                bodyTitle: 'Deleted session',
                                                emailBody: emailBody
                                            };

                                            emailData = {
                                                data: data,
                                                recipients: recipients,
                                                subject: subject,
                                                html: deleteHTML
                                            }

                                            email(emailData);
                                        }
                                    });
                                });
                        }
                    })
                    .catch(error => {
                        next(error)
                    })
            }
        }
    })

}

module.exports = delete_session;