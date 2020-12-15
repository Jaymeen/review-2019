const model = require('../../models/index');
const validator = require('../../utils/validation');
const schema = require('../../utils/schemas').template_list_schema;

const get_templates_list = (request, response, next) => {
  validator(request.body, schema, (error, value) => {
    if (error) {
      next(error)
    }
    else {
      const status_array = ['unused', 'used'];
      let status = request.body.status;
      let index = request.body.pageIndex || 1;
      let size = request.body.pageSize || 5;
      let offset = (index - 1) * size;
      let search = `%${request.body.search || ''}%`;

      let order = { "-1": 'desc', "1": "asc" };
      let sort = {
        "template_name": "t_name",
        "creation_date": "created_at",
        "template_description": "t_description"
      };
      let sort_string = !!request.body.sort ? [sort[request.body.sort], order[request.body.order]] : ['created_at', 'desc'];
      let where = { t_status: { $ne: [3, 4] } }

      if (!!search && !status) {
        where = { t_status: { $ne: [3, 4] }, t_name: { $ilike: `%${search}%` } };
      } else if (!search && !!status) {
        template_status = (status === 'Draft') ? 4 : ((status === 'Saved') ? [1, 2] : { $lt: 3 });
        where = { t_status: template_status };
      } else if (!!search && !!status) {
        template_status = (status === 'Draft') ? 4 : ((status === 'Saved') ? [1, 2] : { $lt: 3 });
        where = { t_name: { $ilike: `%${search}%` }, t_status: template_status };
      }

      if (request.body.search.includes("%")) {
        response.status(200).json(Object.assign({}, [0, []]));
      }
      else {
        if (status == 'Draft') {
          where["created_by"] = request.body.userId;
        }
        model.templateModel.findAll({
          attributes: [
            ['t_id', 'template_id'],
            ['t_name', 'template_name'],
            ['created_at', 'creation_date'],
            ['t_description', 'template_description'],
            ['t_status', 'template_status']
          ],
          where: where,
          order: [sort_string]
        })
          .then(result => {
            let length = result.length;
            let data = result.slice(offset, (index * size));
            let newData = [];
            data.forEach(element => {
              newData.push({
                'template_id': element.dataValues.template_id,
                'template_status': status_array[element.dataValues.template_status - 1],
                'template_description': element.dataValues.template_description,
                'template_name': element.dataValues.template_name,
                'creation_date': element.dataValues.creation_date,
              });
            });

            response.status(200).json(Object.assign({}, [length, newData]));
          })
          .catch((error) => {
            next(error);
          })
      }
    }
  })
}

module.exports = get_templates_list