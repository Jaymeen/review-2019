const { sessionModel } = require('../models/index');

const sessionNameValidator = async (sessionName, sessionId) => {
    return new Promise(function (data, failed) {
        sessionModel.count({
                where: {
                    s_name: {
                        $eq : sessionName
                    },
                    s_id: {
                        $ne: sessionId
                    },
                    s_status: {
                        $ne: 3
                    }
                }
            })
            .then(result => data(result!=0))
            .catch(error => failed(error))
    })
}

module.exports = sessionNameValidator;