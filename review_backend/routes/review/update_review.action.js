const model = require('../../models/index');
const validator = require('../../utils/validation');
const {review_response_schema_update} = require('../../utils/schemas');
const diff = require('deep-diff');
const sendComment = require('./send_comment');
let created_date = Date.now();

const update_review = (request, response, next) => {
    validator(request.body, review_response_schema_update, function(error, value) {
        if (error) {
            next(error);
        } else {
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
                const updates = {
                    r_ans_data: request.body.answer_response,
                    created_by: request.body.user_id,
                    created_at: created_date
                };
                model.reviewModel.update(updates, {
                        where: {
                            r_stm_id: request.body.session_template_mapping_id
                        }
                    })
                    .then(result => {
                        response.status(200).json({ message: "successfully updated the response of the review and updated the status of the mapping table" });
                        const differences = diff(request.body.old_data, request.body.answer_response);
                        if (typeof differences === 'undefined') {} else {
                            commentList = [];
                            diff.observableDiff(request.body.old_data, request.body.answer_response, function(d) {
                                const question_number = d.path[1].split('_')[1];
                                const question = request.body.question_response[Number(question_number) - 1];
                                let comment = {
                                    "mappingId": request.body.session_template_mapping_id,
                                    "parentId": 0,
                                    "user": request.body.user_id,
                                    "commentVisibility": false ,
                                    "systemGenerated": 2
                                };
                                const selected_checkbox = [];
                                if (d.path[2]) {
                                    if (d.rhs == true) {
                                        comment["comment"] = `${request.body.user_name} has selected ${d.path[2]} in ${question}`;
                                    }
                                } else {
                                    comment["comment"] = `${request.body.user_name} has changed ${d.lhs} to ${d.rhs} in ${question}`;
                                }
                                commentList.push(comment);
                            });
                            commentList.forEach(element => {
                                sendComment(element);
                            });
                        }


                    })
                    .catch((error) => {
                        error.code = "SEQFALSEINSERT";
                        next(error);
                    })
            })

        }
    })
}
module.exports = update_review;