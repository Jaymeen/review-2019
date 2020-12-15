const model = require('../../models/index');
const validation = require('../../utils/validation');
const schema = require('../../utils/schemas').mapping_list_schema;

const get_mapping_list = function (request, response, next) {

  validation(request.body, schema, function (error, value) {
    let status_array = ['Pending', 'Published', 'Submitted'];
    let sort = { "session": ["sessions", "s_name"], "reviewee": ["reviewee", "first_name"], "reviewer": ["reviewer", "first_name"] };
    let order = { "-1": 'desc', "1": "asc" }
    let sort_data = !request.body.sort ? ['stm_id'] : request.body.sort === "status" ? ['stm_status', order[request.body.order]] : [sort[request.body.sort][0], sort[request.body.sort][1], order[request.body.order]];

    if (error) {
      next(error);
    } else {
      const index = (!request.body.pageIndex) ? 1 : request.body.pageIndex;
      const size = (!request.body.pageSize) ? 10 : request.body.pageSize;
      const search = `%${request.body.search || ''}%`;
      const status = request.body.status;
      const status_field = (status === 'Pending') ? 1 : ((status === 'Submitted') ? 3 : ((status === 'Published') ? 2 : { $lt: 4 }));
      const offset = (index - 1) * size;
      const sessionStatus = request.body.sessionStatus || 1;

      if (request.body.search.includes("%")) {
        response.status(200).json(Object.assign({}, [0, []]));
      }
      else {
        model.stmModel.findAll({
          attributes: ['stm_id', 'stm_status'],
          include: [{
            model: model.userDetailsModel,
            as: 'reviewee',
            attributes: [
              [model.userDetailsModel.sequelize.literal("reviewee.first_name || ' ' || reviewee.last_name"), 'reviewee_name']
            ]
          },
          {
            model: model.userDetailsModel,
            as: 'reviewer',
            attributes: [
              [model.userDetailsModel.sequelize.literal("reviewer.first_name || ' ' || reviewer.last_name"), 'reviewer_name']
            ]
          },
          {
            model: model.sessionModel,
            as: 'sessions',
            attributes: [
              ['s_name', 'session_name']
            ],
          }
          ],
          where: {
            stm_status: status_field,
            '$sessions.s_status$': sessionStatus,
            $or: [
              { '$sessions.s_name$': { $ilike: search } },
              { '$reviewee.first_name$': { $ilike: search } },
              { '$reviewee.last_name$': { $ilike: search } },
              { '$reviewer.first_name$': { $ilike: search } },
              { '$reviewer.last_name$': { $ilike: search } }
            ]
          },
          order: [
            sort_data
          ],
        })
          .then(result => {
            data = [];
            result.forEach(element => {
              x = {
                "session_template_mapping_id": element.stm_id,
                "session": element.sessions.dataValues.session_name,
                "reviewee": element.reviewee.dataValues.reviewee_name,
                "reviewer": element.reviewer.dataValues.reviewer_name,
                "status": status_array[element.stm_status - 1]
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

module.exports = get_mapping_list;