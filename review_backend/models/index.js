// All the required files and libraries.

const Sequelize = require('sequelize');
const templatemodel = require('./template');
const session_template_mapping = require('./session_template_mapping');
const secondary_reviewer = require('./secondaryReviewer');

const sessionUserDetails = require('./session_user_details');
const session = require('./session');
const review = require('./reviews');
const Designation = require('./designation');
const Comment = require('./comment');
const NotificationDetail = require('./notification_detail');

// Connection with the Database.

const sequelize = new Sequelize('employeedbtest', 'postgres', 'argusadmin', {
    host: '192.1.200.74',
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false
    },
    dialectOptions: {
        useUTC: false, // for reading from database
    },
    timezone: '+05:30'
});

//Initialization of serialize models.

const designationModel = Designation(sequelize, Sequelize);
const userDetailsModel = sessionUserDetails(sequelize, Sequelize);
const templateModel = templatemodel(sequelize, Sequelize);
const stmModel = session_template_mapping(sequelize, Sequelize);
const secondaryReviewerModel = secondary_reviewer(sequelize, Sequelize);

const sessionModel = session(sequelize, Sequelize);
const reviewModel = review(sequelize, Sequelize);
const commentModel = Comment(sequelize, Sequelize);
const notificationDetailModel = NotificationDetail(sequelize, Sequelize);

// Below associations are for the table mapping of database.
// Providing the  relationships for the notificationdetail Model.
userDetailsModel.hasMany(notificationDetailModel, {
    foreignKey: 'nd_for',
    sourceKey: 'user_id'
});

// Providing the has many relationships for the Designation Model.
designationModel.hasMany(userDetailsModel, {
    foreignKey: 'desg_id',
    sourceKey: 'des_id'
});

// Providing one to many relations for UserDetails Model.
userDetailsModel.hasMany(templateModel, {
    foreignKey: 'created_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(templateModel, {
    foreignKey: 'modified_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(stmModel, {
    foreignKey: 'created_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(stmModel, {
    foreignKey: 'modified_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(stmModel, {
    foreignKey: 'stm_reviewee_id',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(stmModel, {
    foreignKey: 'stm_reviewer_id',
    sourceKey: 'user_id'
});

// Providing has many relationship for Template Model.
templateModel.hasMany(stmModel, {
    foreignKey: 'stm_template_id',
    sourceKey: 't_id'
});

// Providing has many relationship for the Session Model.
sessionModel.hasMany(stmModel, {
    foreignKey: 'stm_session_id',
    sourceKey: 's_id'
});

// Providing has many relationships for the UserDetails Model. 
userDetailsModel.hasMany(sessionModel, {
    foreignKey: 'created_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(sessionModel, {
    foreignKey: 'modified_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(reviewModel, {
    foreignKey: 'created_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(reviewModel, {
    foreignKey: 'modified_by',
    sourceKey: 'user_id'
});
userDetailsModel.hasMany(commentModel, {
    foreignKey: 'created_by',
    sourceKey: 'user_id'
});

stmModel.hasMany(reviewModel, {
    foreignKey: 'r_stm_id',
    sourceKey: 'stm_id'
});
stmModel.hasMany(commentModel, {
    foreignKey: 'c_stm_id',
    sourceKey: 'stm_id'
});

stmModel.hasMany(secondaryReviewerModel, {
    foreignKey: 'sr_stm_id',
    sourceKey: 'stm_id',
    as: 'secondaryReviewers'
});
secondaryReviewerModel.belongsTo(stmModel, {
    foreignKey: 'sr_stm_id',
})

userDetailsModel.hasMany(secondaryReviewerModel, {
    foreignKey: 'sr_reviewer_id',
    sourceKey: 'user_id'
});
secondaryReviewerModel.belongsTo(userDetailsModel, {
    foreignKey: 'sr_reviewer_id',
    as: 'reviewerNames'
});

// Providing belongs to relationship for the UserDetails Model.
userDetailsModel.belongsTo(designationModel, {
    foreignKey: 'desg_id'
});
// Providing belongs to relationships for the Template Model.

templateModel.belongsTo(userDetailsModel, {
    foreignKey: 'created_by',
    as: 'createdBy'
});
templateModel.belongsTo(userDetailsModel, {
    foreignKey: 'modified_by',
    as: 'modifiedBy'
});

// Providing belongs to relationship for the Session Template Mapping Model.
stmModel.belongsTo(userDetailsModel, {
    foreignKey: 'created_by',
    as: 'creator'
});
stmModel.belongsTo(userDetailsModel, {
    foreignKey: 'modified_by',
    as: 'modifier'
});
stmModel.belongsTo(userDetailsModel, {
    foreignKey: 'stm_reviewee_id',
    as: 'reviewee'
});
stmModel.belongsTo(userDetailsModel, {
    foreignKey: 'stm_reviewer_id',
    as: 'reviewer'
});
stmModel.belongsTo(templateModel, {
    foreignKey: 'stm_template_id',
    as: 'templates'
});
stmModel.belongsTo(sessionModel, {
    foreignKey: 'stm_session_id',
    as: 'sessions'
});


// Providing belongs to relationships for the Session Model.
sessionModel.belongsTo(userDetailsModel, {
    foreignKey: 'created_by',
    as: 'createdBy'
});
sessionModel.belongsTo(userDetailsModel, {
    foreignKey: 'modified_by',
    as: 'modifiedBy'
});

// Providing belongs to relationships for the Review Model.
reviewModel.belongsTo(userDetailsModel, {
    foreignKey: 'created_by',
    as: 'createdBy'
});
reviewModel.belongsTo(userDetailsModel, {
    foreignKey: 'modified_by',
    as: 'modifiedBy'
});
reviewModel.belongsTo(stmModel, {
    foreignKey: 'r_stm_id',
    as: 'template'
});
commentModel.belongsTo(stmModel, {
    foreignKey: 'c_stm_id',
    as: 'mapping'
})
commentModel.belongsTo(userDetailsModel, {
    foreignKey: 'created_by',
    as: 'createdBy'
})

module.exports = {
    userDetailsModel,
    stmModel,
    sessionModel,
    templateModel,
    designationModel,
    reviewModel,
    commentModel,
    notificationDetailModel,
    secondaryReviewerModel

};