const { commentModel } = require('../../models/index');
const updateComment = async(updateData, commentList) => {
    return new Promise(function(data, failed) {
        commentModel.update(updateData, {
                where: {
                    $or:[
                        {'c_id': {$in: commentList}},
                        {'c_parent': {$in: commentList}}
                    ]
                }
            })
            .then(result => {
                data(result);
            })
            .catch((error) => {
                error.code = "SEQFALSEINSERT";
                failed(error);
            })
    })
}

module.exports = updateComment