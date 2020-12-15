function errorMessage(error) {
    let message = "";
    // Note : More Error Codes would be added as per our requirements.
    switch (error.code) {
        case '42P01':
            message = "Table you requested for was not found.";
            break;
        case '42703':
            message = "Column you requested for was not found.";
            break;
        case '42601':
            message = "Insert query has more expressions than target or vice versa.";
            break;
        case '28P01':
            message = "Connection with the Database Failed.";
            break;
        case '3D000':
            message = "Database you requested to connect for does not exist.";
            break;
        case 'ENOTFOUND':
            message = "Host Connection Error.";
            break;
        case 'ECONNREFUSED':
            message = "Connection Refused.";
            break;
        case '403':
            message = "Server is Refusing to Respond to your Request.";
            break;
        case '404':
            message = "Requested Resource could not be Found.";
            break;
        case '500':
            message = "Internal Server Error.";
            break;
        case 'SIDNOTFOUND':
            message = "The given session id does not exist";
            break;
        case 'SIDACTIVE':
            message = "Session is active cannot delete";
            break;
        case 'SIDINSTM':
            message = "Mapping for this session already exists";
            break;
        case 'STMIDNOTFOUND':
            message = "There does not any mapping in the Mapping table for given id";
            break;
        case 'JOIFALSE':
            message = error.message;
            break;
        case 'JWTFALSE':
            message = "Session expired, please login again !!!";
            break;
        case 'TOKENFALSE':
            message = "Login failed!!!";
            break;
        case 'LOGINFALSE':
            message = "Your mail Id is not valid !";
            break;
        case 'SEQFALSEINSERT':
            message = "Insertion/Updation in the table failed !";
            break;
        case 'INVALIDID':
            message = "Requested data not found !";
            break;
        case 'TEMPLATEUPDATEFALSE':
            message = "Requested template can not be updated !";
            break;
        case 'NORECORD':
            message = "No record found for this data";
            break;
        case 'UNIQUEVIOLATION':
            message = "Name must be unique";
            break;
        case 'TEMPLATEINUSE':
            message = "Template already in use";
            break;
        case 'SESSIONNOTACTIVE':
            message = "Cannot map inactive or deleted session.";
            break;
        case 'SEARCHFALSE':
            message = "Invalid Search";
            break;
        default:
            message = "Message not found.";
    }
    return message;
}

module.exports = errorMessage;
