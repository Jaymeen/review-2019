const {
    stmModel,
    templateModel,
    userDetailsModel,
    sessionModel,
    secondaryReviewerModel
} = require('../../models/index');
const _ = require('lodash')
const validator = require('../../utils/validation');
const { session_id_schema } = require('../../utils/schemas');
const { getObjects } = require('./getSecondaryReviewers');
session_template_mapping_details = (request, response, next) => {
    const page_index = (request.body.pageIndex === undefined) ? 1 : request.body.pageIndex;
    const page_size = (request.body.pageSize === undefined) ? 5 : request.body.pageSize;
    const sortColumn = (request.body.sort === undefined) ? "template_name" : request.body.sort;
    let order = "asc";
    order = (request.body.order === undefined) ? order : (request.body.order == -1 ? "desc" : order);
    validator(request.params, session_id_schema, (error, value) => {
        if (error) {
            next(error);
        } else {
            const offset = page_size * (page_index - 1);
            sessionModel.findOne({
                where: {
                    s_id: request.params.session_id
                }
            }).then(result => {
                if (result === null) {
                    let error = new Error();
                    error.code = 'SIDNOTFOUND';
                    return next(error);
                }
                return result;
            }).then((resultmain) => {
                if (resultmain === null) {
                    return;
                }
                return stmModel.findAll({
                    attributes: ['stm_id'],
                    where: {
                        stm_session_id: request.params.session_id
                    },
                    include: [{
                        model: userDetailsModel,
                        as: 'reviewer',
                        attributes: [
                            [userDetailsModel.sequelize.literal("reviewer.first_name || ' ' || reviewer.last_name"), 'full_name']
                        ]
                    },
                    {
                        model: userDetailsModel,
                        as: 'reviewee',
                        attributes: [
                            [userDetailsModel.sequelize.literal("reviewee.first_name || ' ' || reviewee.last_name"), 'full_name']
                        ]
                    },
                    {
                        model: templateModel,
                        as: 'templates',
                        attributes: ['t_name']
                    }
                    ]
                })
                    .then((result) => {
                        let respo = getObjects(result);
                        return respo;
                    })
                    .then((result) => {
                        let final = {};
                        result.forEach((obj) => {
                            if (final.hasOwnProperty(obj.reviewer_name)) {
                                let secreviewer_obj = final[obj.reviewer_name];
                                if (secreviewer_obj.hasOwnProperty(obj.secondaryReviewers)) {
                                    let reviewee_obj = secreviewer_obj[obj.secondaryReviewers];
                                    if (reviewee_obj.hasOwnProperty(obj.template_name)) {
                                        let reviewer_list = reviewee_obj[obj.template_name];
                                        reviewer_list.push(obj.reviewee);
                                    } else {
                                        reviewee_obj[obj.template_name] = [obj.reviewee];
                                    }
                                } else {
                                    let innerobj = {};
                                    innerobj[obj.template_name] = [obj.reviewee];
                                    secreviewer_obj[obj.secondaryReviewers] = innerobj;
                                }
                            } else {
                                let secondaryObj = {};
                                let innerobj = {};
                                innerobj[obj.template_name] = [obj.reviewee];
                                secondaryObj[obj.secondaryReviewers] = innerobj;
                                final[obj.reviewer_name] = secondaryObj;
                            }
                        });
                        return final;
                    })
                    .then((result) => {
                        let menu = [];
                        let length;
                        for (var i in result) {
                            for (let j in result[i]) {
                                for (let template in result[i][j]) {
                                    menu.push({
                                        'reviewer_name': i,
                                        'secondaryreviewer_name': [j],
                                        'template_name': template,
                                        'reviewees': [(result[i][j])[template]]
                                    });
                                }
                            }
                        }
                        if (sortColumn === "template_name") {
                            menu = _.orderBy(menu, [data => data[sortColumn].toLowerCase()], [order]);
                        } else {
                            menu = _.orderBy(menu, [data => data.reviewer_name.toLowerCase(), data => data.template_name.toLowerCase()], [order]);
                        }
                        length = menu.length;
                        menu = menu.slice(offset, (page_index * page_size));
                        let sessionData = {
                            sessionName: resultmain.dataValues.s_name,
                            sessionStatus: resultmain.dataValues.s_status
                        }
                        response.status(200).json(Object.assign({}, [menu, length, sessionData]));
                    })
            })
                .catch(error => {
                    next(error);
                });
        }
    });
};

module.exports = session_template_mapping_details;