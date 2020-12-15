const { sessionModel } = require('../models/index');

const getSessionData = async (sessionId) => {
    return new Promise(function (data, failed) {
        sessionModel.findOne({
            attributes: [
                ['s_name', 'session_name'],
                ['s_ending_date', 'deadline']
            ],
            where: {
                's_id': sessionId,
            }
        })
            .then(result => {
                data({
                    name: result.dataValues.session_name,
                    deadline: result.dataValues.deadline
                });
            })
            .catch(
                error => failed(error)
            )
    })
}

module.exports = getSessionData;



