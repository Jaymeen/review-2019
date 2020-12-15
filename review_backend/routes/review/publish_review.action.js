const model = require('../../models/index');
const schema = require('../../utils/schemas').publish_mapping_schema;
const validator = require('../../utils/validation');
const notification = require('../notification/notification_insert_function');

const publish_review = (request, response, next) => {
    validator(request.body, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let date = Date.now();
            model.stmModel.update(
                { stm_status: 2, modified_by: request.body.userId, modified_at: date }, {
                    where: {
                        'stm_id': request.body.mappingId
                    }
                })
                .then(result => {

                    
                    response.status(200).json({ "message": "review publish succesfully !!" });

                    let notificationData = {
                        "mappingId": request.body.mappingId,
                        "modifiedBy": request.body.userId,
                        "date": date
                    }
                    notification(7, notificationData);

                })
                .catch((error) => {
                    error.code = "SEQFALSEINSERT";
                    next(error);
                })
        }
    });
}

module.exports = publish_review;