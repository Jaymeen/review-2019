
const models = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').mapping_list_schema;

const get_sessionlist = (request, response, next) => {
  let status_array = ['active', 'inactive'];
  const page_index = (!request.body.pageIndex) ? 1 : request.body.pageIndex;
  const page_size = (!request.body.pageSize) ? 10 : request.body.pageSize;
  const search = `%${request.body.search || ''}%`;
  const status = request.body.status;
  const sort = request.body.sort;
  const order = request.body.order;

  validator(request.body, schema, function (error, value) {
    if (error)
      return next(error);

    let sort_array = {
      "session_name": ["s_name"],
      "review_cycle_frequency": ["s_frequency"],
      "session_description": ["s_description"],
      "session_status": ["s_status"],
      "session_starting_date": ["s_starting_date"],
      "session_ending_date": ["s_ending_date"],
      "session_created_at": ["created_at"]
    };
    let order_array = { "-1": 'desc', "1": "asc" };
    let sort_data = !sort ? ['created_at', 'desc'] : (sort === "session_status") ? ['s_status', order_array[order]] : [sort_array[sort][0], order_array[order]];
    offset = (page_index - 1) * page_size;

    let session_status = (status === 'Active') ? 1 : ((status === 'Inactive') ? 2 : { $lt: 3 });

    if (request.body.search.includes("%")) {
      response.status(200).json(Object.assign({}, [0, []]));
    }
    else {
      models.sessionModel.findAll({
        attributes: [
          ['s_id', 'session_id'],
          ['s_name', 'session_name'],
          ['s_frequency', 'review_cycle_frequency'],
          ['s_starting_date', 'session_starting_date'],
          ['s_ending_date', 'session_ending_date'],
          ['s_description', 'session_description'],
          ['s_version', 'sessionVersion'],
          ['s_status', 'session_status'],
          ['s_version','session_version'],
          ['created_at', 'session_created_at']
        ],
        where: { s_name: { $ilike: search } , s_status: session_status },
        order: [sort_data, ['s_status', 'asc']]
      })
        .then(result => {
          for (let i = 0; i < result.length; i++) {
            result[i].dataValues.session_status = status_array[result[i].dataValues.session_status - 1];
            result[i].dataValues.review_cycle_frequency = `every ${result[i].dataValues.review_cycle_frequency} months`
          }
          length = result.length;
          result = result.slice(offset, (page_index * page_size));
          response.status(200).json(Object.assign({}, [length, result]));
        })
        .catch(error => { return next(error); })
    }
  })
}

module.exports = get_sessionlist;
