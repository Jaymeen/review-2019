const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').mapping_id_schema;
const getSecondaryReviewersList = require('../session/getSecondaryReviewersList');
const get_reviews = (request, response, next) => {
    validator(request.params, schema, function (error, value) {
        if (error) {
            next(error);
        }
        else {
            let status_array = ['Pending', 'Published', 'Submitted'];
            model.stmModel.findOne({
                attributes: [['stm_status', 'status'], 'stm_reviewee_id', 'stm_reviewer_id', 'stm_template_id'],
                include: [
                    {
                        model: model.userDetailsModel,
                        as: 'reviewee',
                        attributes: [
                            ['first_name', 'reviewee_name']
                        ]
                    },
                    {
                        model: model.userDetailsModel,
                        as: 'reviewer',
                        attributes: [
                            ['first_name', 'reviewer_name']
                        ]
                    },
                    {
                        model: model.templateModel,
                        as: 'templates',
                        attributes: [
                            ['t_name', 'template_name'],
                        ],
                    },
                    {
                        model: model.sessionModel,
                        as: 'sessions',
                        attributes: [
                            ['s_name', 'session_name'],
                            ['s_ending_date', 'session_ending_date'],
                        ],
                    }
                ],
                where: {
                    'stm_id': request.params.mappingId
                }
            })
                .then(result => {
                    if (!result) {
                        let error = new Error();
                        error.code = 'NORECORD';
                        next(error);
                    }
                    else {
                        getSecondaryReviewersList(request.params.mappingId).then( secondaryReviewers => {
                            response.status(200).json({
                                "status": status_array[result.dataValues.status - 1],
                                "revieweeId": result.dataValues.stm_reviewee_id,
                                "reviewerId": result.dataValues.stm_reviewer_id,
                                "templateId": result.dataValues.stm_template_id,
                                "reviewee": result.dataValues.reviewee.dataValues.reviewee_name,
                                "reviewer": result.dataValues.reviewer.dataValues.reviewer_name,
                                "templateName": result.dataValues.templates.dataValues.template_name,
                                "sessionName": result.dataValues.sessions.dataValues.session_name,
                                "sessionEndingDate": result.dataValues.sessions.dataValues.session_ending_date,
                                "secondaryReviewers" : secondaryReviewers
                            });
                        });
                    }
                })
                .catch((error) => {
                    next(error);
                })
        }
    })
}

module.exports = get_reviews;