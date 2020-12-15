module.exports = function(sequelize, DataTypes) {
    return sequelize.define('comment', {
        c_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        c_stm_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        c_data: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        c_visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        c_parent: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        c_system_generated: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: '1'
        }
    }, {
        tableName: 'comment'
    });
};