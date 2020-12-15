const {
  stmModel,
  sessionModel,
  templateModel,
  userDetailsModel,
  secondaryReviewerModel
} = require('../../../models/index');
const validation = require('../../../utils/validation');
const schema = require('../../../utils/schemas').reviewees_list_schema;

const get_reviewees = function (request, response, next) {
  validation(request.body, schema, function (error, value) {
    if (error) {
      next(error);
    } else {
      let status_array = ['Pending', 'Published', 'Submitted'];
      let sort = {
        "session_name": ["sessions", "s_name"],
        "name": ["reviewee", "first_name"],
        "template_name": ["templates", "t_name"],
        "deadline": ["sessions", "s_ending_date"]
      };
      let order = {"-1": "desc","1": "asc"};
      let sort_data = !request.body.sort ? ['s_ending_date'] :
        request.body.sort === "status" ? ['stm_status', order[request.body.order]] : [sort[request.body.sort][0], sort[request.body.sort][1], order[request.body.order]];
      let check_search;
      let flag;
      const index = (!request.body.pageIndex) ? 1 : request.body.pageIndex;
      const size = (!request.body.pageSize) ? 10 : request.body.pageSize;
      const search = `%${request.body.search || ''}%`;
      const status = request.body.status;
      const status_field = (status === 'Pending') ? 1 : ((status === 'Submitted') ? 3 : ((status === 'Published') ? 2 : {
        $lt: 4
      }));
      const offset = (index - 1) * size;

      if (request.body.search.includes("%")) {
        response.status(200).json(Object.assign({}, [0, []]));
      } else {
        stmModel.findAll({
            attributes: ['stm_id', 'stm_template_id', 'stm_reviewer_id', 'stm_reviewee_id', 'stm_status'],
            include: [{
                model: secondaryReviewerModel,
                as: 'secondaryReviewers',
                required: false,
                attributes: []
              },
              {
                model: templateModel,
                as: 'templates',
                attributes: [
                  ['t_name', 'template_name']
                ]
              },
              {
                model: userDetailsModel,
                as: 'reviewee',
                attributes: [
                  [userDetailsModel.sequelize.literal("reviewee.first_name || ' ' || reviewee.last_name"), 'reviewee_name']
                ]
              },
              {
                model: sessionModel,
                as: 'sessions',
                attributes: [
                  ['s_name', 'session_name'],
                  ['s_ending_date', 'deadline']
                ],
                where: {
                  's_status': 1
                }
              }
            ],
            where: {
              $and:[
                {$or: [
                  {stm_reviewer_id: request.body.userId}, 
                  {'$secondaryReviewers.sr_reviewer_id$': request.body.userId},
                ]},
                {$or: [
                  { '$sessions.s_name$': { $ilike: search } },
                  { '$reviewee.first_name$': { $ilike: search } },
                  { '$reviewee.last_name$': { $ilike: search } },
                  { '$templates.t_name$': { $ilike: search } }
                ]}
              ],
              stm_status: status_field,

            },
            order: [
              sort_data
            ]
          })
          .then(result => {
            let data = [];

            result.forEach(element => {
              x = {
                "session_template_mapping_id": element.stm_id,
                "template_id": element.stm_template_id,
                "reviewee_id": element.stm_reviewee_id,
                "status": status_array[element.stm_status - 1],
                "template_name": element.templates.dataValues.template_name,
                "name": element.reviewee.dataValues.reviewee_name,
                "session_name": element.sessions.dataValues.session_name,
                "deadline": element.sessions.dataValues.deadline,
                "isPrimary": element.stm_reviewer_id != request.body.userId ? false : true
              }
              data.push(x);
            });


            length = data.length;
            data = data.slice(offset, (index * size));
            response.status(200).json(Object.assign({}, [length, data]));
          })
          .catch((error) => {
            next(error);
          })
      }
    }
  })
}

module.exports = get_reviewees;