module.exports = function (sequelize, DataTypes) {
	return sequelize.define('notification_detail', {
		nd_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		nd_type: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		nd_for: {
			type: DataTypes.INTEGER,
			allowNull: false
        },
        nd_is_seen: {
			type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
		},
		nd_ref: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created_at: {
			type: DataTypes.DATE,
			allowNull: false
		},
		nd_message: {
			type: DataTypes.STRING,
			allowNull: false
		},
		nd_header: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		tableName: 'notification_detail'
	});
};