const model = require('../../../models/index');
const validator = require('../../../utils/validation');
const schema = require('./session.validation').session_mappingdetails_schema;
const sessionIdSchema = require('../../../utils/schemas').session_id_schema;
require('dotenv').config();
const notification = require('../../notification/notification_insert_function');
const addToSessionMapping = require('./insertIntoSessionMapping');
const addToSecondaryReviewer = require('./insertIntoSecondaryReviewer');
const getSecondaryReviewersList = require('../getSecondaryReviewersList');
const sendMappingEmail = require('./sendMappingEmail.action');
let notificationData = [];

const post_mapping_array = (request, response, next) => {
  validator(request.params, sessionIdSchema, function (error, values) {
    if (error) {
      next(error);
    } else {
      validator(request.body, schema, function (error, values) {
        if (error) {
          next(error);
        } else {
          model.sessionModel.findOne({
            where: {
              s_id: request.params.session_id
            }
          }).then(result => {
            if (result == null) {
              let error = new Error();
              error.code = 'SIDNOTFOUND';
              return next(error);
            }
            else if (result.dataValues.s_status != 1) {
              let error = new Error();
              error.code = 'SESSIONNOTACTIVE';
              return next(error);
            } return result;
          }).then((resultmain) => {
            if (resultmain == null) {
              return
            }

            let data = [];
            let templateId = [];
            let mailObject;
            let mailData = [];
            let dataOfSecondaryReviewer = [];
            let reviewerId = [];

            request.body.forEach(element => {
              element.reviewees.forEach(function (list) {
                map_obj = {
                  stm_session_id: Number(request.params.session_id),
                  stm_template_id: element.template.template_id,
                  stm_reviewer_id: element.primaryReviewer.reviewer_id,
                  stm_reviewee_id: list.reviewee_id,
                  stm_status: 1,
                  stm_version: resultmain.dataValues.s_version,
                  created_by: Number(request.query.userId),
                  created_at:  Date.now() 
                }
                templateId.push(element.template.template_id);
                data.push(map_obj);
                addToSessionMapping(map_obj).then(x => {
                  dataOfSecondaryReviewer = [];
                  if (element.secondaryReviewers.length !== 0) {
                    dataOfSecondaryReviewer = [];
                    element.secondaryReviewers.forEach(reviewer => {
                      secondary_reviewer_data = {
                        sr_stm_id: x,
                        sr_reviewer_id: reviewer.reviewer_id,
                      }
                      dataOfSecondaryReviewer.push(secondary_reviewer_data);
                    })
                    addToSecondaryReviewer(dataOfSecondaryReviewer).then(b => {
                      dataOfSecondaryReviewer = []
                    }).catch(k => {
                      next(error);
                    })
                  }
                }).catch((stmId) => {
                  if (stmId.parent.constraint == "group_key_unique") {
                    if (element.secondaryReviewers.length !== 0) {
                      dataOfSecondaryReviewer = [];
                      getSecondaryReviewersList(stmId.stm_id).then(reviewers => {
                        element.secondaryReviewers.forEach(reviewer => {
                          if (!reviewers.includes(reviewer.reviewer_id)) {
                            secondary_reviewer_data = {
                              sr_stm_id: stmId.stm_id,
                              sr_reviewer_id: reviewer.reviewer_id,
                            }
                            dataOfSecondaryReviewer.push(secondary_reviewer_data);
                          }
                        })
                        if (dataOfSecondaryReviewer.length != 0) {
                          addToSecondaryReviewer(dataOfSecondaryReviewer).then(b => {
                          }).catch(error => {
                            next(error);
                          })
                          dataOfSecondaryReviewer = [];
                        }
                      })
                    }
                  }
                })

                reviewerId.push(element.primaryReviewer.reviewer_id);
                element.secondaryReviewers.forEach(reviewer => {
                  reviewerId.push(reviewer.reviewer_id);
                });

                mailObject = {
                  sessionId: request.params.session_id,
                  reviewerId: reviewerId,
                  revieweeId: list.reviewee_id
                }
                reviewerId = [];
                mailData.push(mailObject);
              });
            });

            response.status(200).json({ "message": "Candidate mapping saved successfully !!" });
            data.forEach(element => {
              notificationData.push({
                "reviewer": element.stm_reviewer_id,
                "reviewee": element.stm_reviewee_id
              })
            });

            const updates = {
              t_status: 2
            };

            model.templateModel.update(updates, {
              where: {
                't_id': { $in: templateId },
              }
            })
              .then((result) => {
                sendMappingEmail(mailData);
                notification(4, mailData);
              })
              .catch(error => {
                next(error);
              });
          })
        }
      });
    }
  });
}
module.exports = post_mapping_array;