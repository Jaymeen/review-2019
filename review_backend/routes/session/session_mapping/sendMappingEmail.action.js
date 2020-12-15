const getSessionData = require('../../../utils/getSessionData');
const getUserData = require('../../../utils/getUserData');
const path = require('path');
const fs = require("fs");
const email = require('../../../utils/email');
const getFormattedDate = require('../../../utils/getFormattedDate');

const getEmailData = async (mailData) => {
    return new Promise(function (result, failed) {
        mailData.forEach(mailObject => {
            getSessionData(mailObject.sessionId).then(
                sessionData => {
                    getUserData(mailObject.reviewerId).then(
                        reviewerList => {
                            getUserData([mailObject.revieweeId]).then(
                                revieweeList => {
                                    let revieweeNames = '';
                                    let reviewerNames = '';

                                    for (reviewer of reviewerList) {
                                        reviewerNames = reviewerNames + ', ' + reviewer.name;
                                    }
                                    for (reviewee of revieweeList) {
                                        revieweeNames = revieweeNames + ', ' + reviewee.name;
                                    }

                                    reviewerNames = reviewerNames.substr(1);
                                    revieweeNames = revieweeNames.substr(1);
                                    
                                    let filePath = path.join(__dirname, '../../..', 'templates', 'emailTemplate.html');
                                    let mappingHTML = fs.readFileSync(filePath, 'utf8').toString();

                                    let reviewerSubject = 'ERS | Review Scheduled !';
                                    let revieweeSubject = 'ERS | Review initiated !';

                                    let emailBody ="<table><tr><td style='width: 100px; vertical-align: top;'>Name :</td><td><span style='font-weight: 600;'>" + sessionData.name + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Deadline :</td><td><span style='font-weight: 600;'>" + getFormattedDate(new Date(sessionData.deadline)) + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Reviewers :</td><td><span style='font-weight: 600;'>" + reviewerNames + "</span></td></tr><tr><td style='width: 100px; vertical-align: top;'>Reviewees :</td><td><span style='font-weight: 600;'>" + revieweeNames + "</span></td></tr></table>";

                                    let reviewerData = {
                                        emailTag: 'You have been selected as Reviewer !',
                                        bodyTitle: 'Review scheduled',
                                        emailBody: emailBody
                                    };
                                    let revieweeData = {
                                        emailTag: 'You have been selected as Reviewee !',
                                        bodyTitle: 'Review initiated',
                                        emailBody: emailBody
                                    };

                                    revieweeEmailData = {
                                        data: revieweeData,
                                        recipients: revieweeList,
                                        subject: revieweeSubject,
                                        html: mappingHTML
                                    }
                                    reviewerEmailData = {
                                        data: reviewerData,
                                        recipients: reviewerList,
                                        subject: reviewerSubject,
                                        html: mappingHTML
                                    }

                                    email(revieweeEmailData);
                                    email(reviewerEmailData);
                                }
                            );
                        }
                    );
                }
            )
        });
    })
}

module.exports = getEmailData;



