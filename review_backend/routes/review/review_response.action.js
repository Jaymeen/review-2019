const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').review_response_schema;
const notification = require('../notification/notification_insert_function');
let created_date = Date.now();

const review_response = (request, response, next) => {
    validator(request.body, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            model.stmModel.findOne({
                where: { stm_id: request.body.session_template_mapping_id }
            })
                .then(result => {
                    if (result === null) {
                        let error = new Error();
                        error.code = "STMIDNOTFOUND";
                        next(error);
                    }
                    return result;
                })
                .then(() => {
                    model.reviewModel.create({
                        r_stm_id: request.body.session_template_mapping_id,
                        r_ans_data: request.body.answer_response,
                        created_by: request.body.user_id,
                        created_at: created_date
                    })
                    .then(result => {
                        model.stmModel.update(
                            {stm_status: 3},
                            {where: {stm_id : request.body.session_template_mapping_id}}
                        )
                        .then(
                        response.status(200).json({ message: "successfully stored the response of the review and updated the status of the mapping table" }))
                        let notificationData = {
                            "mappingId": request.body.session_template_mapping_id,
                            "createdBy": request.body.user_id,
                            "date": created_date
                        }
                        notification(8, notificationData);


                    })
                })

                .catch((error) => {
                    error.code = "SEQFALSEINSERT";
                    next(error);
                })
        }
    })
}

module.exports = review_response;

















