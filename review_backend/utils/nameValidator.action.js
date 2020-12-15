const sessionNameValidator = require('./sessionNameValidator');
const templateNameValidator = require('./templateNameValidator');
const validator = require('./validation');
const { nameValidationSchema } = require('./schemas');

const nameValidatior = (request, response, next) =>{
    validator(request.query, nameValidationSchema, function(error, value) {
        if (error) {
            next(error);
        } else {
            if(request.query.modelName === 'template'){
                templateNameValidator(request.query.name, request.query.isUpdate).then(
                    result=> response.status(200).json(result)
                )
            }
            else if(request.query.modelName === 'session'){
                sessionNameValidator(request.query.name, request.query.isUpdate).then(
                    result=> response.status(200).json(result)
                )
            }
            else{
                let modelError = new Error();
                modelError.code = '404'
                next(modelError);
            }
        }
    });
}

module.exports = nameValidatior;