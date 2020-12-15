module.exports = function (sequelize, DataTypes) {
    return sequelize.define('secondary_reviewer', {
        sr_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sr_stm_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        sr_reviewer_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
            tableName: 'secondary_reviewer'
        });
};