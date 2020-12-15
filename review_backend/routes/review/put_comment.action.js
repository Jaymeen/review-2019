const schema = require('../../utils/schemas').comment_id_schema;
const validator = require('../../utils/validation');
const updateComment = require('./updateComment');

const put_comments = (request, response, next) => {
    validator(request.body, schema, function(error, value) {
        if (error) {
            next(error);
        } else {
            updateComment({ c_visible: false }, request.body.commentId).then(
                    result => {
                        response.status(200).json({ "message": "comment updated succesfully !!" });
                    })
                .catch((error) => {
                    error.code = "SEQFALSEINSERT";
                    next(error);
                })
        }
    });
}

module.exports = put_comments;