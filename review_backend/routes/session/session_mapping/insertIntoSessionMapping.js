const model = require('../../../models/index');

const addToStm = async (stmData) => {

    return new Promise(function (data, failed) {
        model.stmModel.create({
            stm_session_id: stmData.stm_session_id,
            stm_template_id: stmData.stm_template_id,
            stm_reviewer_id: stmData.stm_reviewer_id,
            stm_reviewee_id: stmData.stm_reviewee_id,
            stm_status: stmData.stm_status,
            created_by: stmData.created_by,
            created_at: stmData.created_at,
            stm_version: stmData.stm_version
        })
            .then(result => {
                data(`${result.dataValues.stm_id} `)
            })

            .catch(error => {
                let stm_id;
                model.stmModel.findOne({
                    where: {
                        stm_session_id: stmData.stm_session_id,
                        stm_template_id: stmData.stm_template_id,
                        stm_reviewer_id: stmData.stm_reviewer_id,
                        stm_reviewee_id: stmData.stm_reviewee_id,
                        stm_status: stmData.stm_status,
                    }
                }).then(result => {
                    stm_id = result.dataValues.stm_id;
                    failed(Object.assign({}, { stm_id: stm_id }, error))
                });
            })
    })
}

module.exports = addToStm;



