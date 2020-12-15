const nodemailer = require("nodemailer");
const async = require("async");
const ejs = require('ejs');
require('dotenv').config();

let smtpTransport = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

function email(emailData) {
    let mailOptions;
    async.forEach(emailData.recipients, function (element) {
        emailData.data.recipient_name = element.name;
        emailHTML = ejs.render(emailData.html, emailData.data);

        mailOptions = {
            // to: element.email,
            to: process.env.MAIL_TO,
            subject: emailData.subject,
            html: emailHTML
        }
        
        smtpTransport.sendMail(mailOptions, function (error, response) {
            
        });
    });
}

module.exports = email;