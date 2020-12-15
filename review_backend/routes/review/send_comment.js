const { commentModel } = require('../../models/index');
const sendComment = async(commentData) => {
    return new Promise(function(data, failed) {
        let created_date = Date.now();
        commentModel.create({
                c_data: commentData.comment,
                c_stm_id: commentData.mappingId,
                c_parent: commentData.parentId,
                created_by: commentData.user,
                c_visible:  commentData.commentVisibility,
                c_system_generated: commentData.systemGenerated,
                created_at: created_date
            })
            .then(result => {
                let parentId = commentData.parentId == 0 ? result.dataValues.c_id : commentData.parentId;
                commentModel.update({
                        c_parent: parentId,
                    }, {
                        where: {
                            'c_id': result.dataValues.c_id
                        }
                    })
                    .then(() => {
                        data(result);
                    })
            })
            .catch((error) => {
                error.code = "SEQFALSEINSERT";
                failed(error);
            })
    })
}

module.exports = sendComment