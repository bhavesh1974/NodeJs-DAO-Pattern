/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('employee', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		dob: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		street: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		city: {
			type: DataTypes.STRING(100),
			allowNull: true
		},
		state: {
			type: DataTypes.STRING(50),
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true
		}
	}, {
		tableName: 'employee'
	});
};
