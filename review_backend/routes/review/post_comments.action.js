const model = require('../../models/index');
const schema = require('../../utils/schemas').comment_schema;
const validator = require('../../utils/validation');
const notification = require('../notification/notification_insert_function');
const sendComment = require('./send_comment');
let created_date = Date.now();

const post_comments = (request, response, next) => {
    validator(request.body, schema, function(error, value) {
        if (error) {
            return next(error);
        } else {
            request.body["systemGenerated"]=1;
            sendComment(request.body).then(
                result => {
                    response.status(200).json({
                        "message": "comment inserted succesfully !!"
                    });
                    let notificationData = {
                        "mappingId": request.body.mappingId,
                        "createdBy": request.body.user,
                        "date": created_date
                    }
                    notification(9, notificationData);
                },
                error => {
                    next(error);
                }
            )
        }
    });
}
module.exports = post_comments;