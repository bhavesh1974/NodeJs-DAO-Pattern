const BaseDao = require("../shared/dao/baseDao");
const Employee = require("../model/employee");

module.exports = class EmployeeDao extends BaseDao {
  constructor() {
    super("employee");
  }
  mapDataToModel(data) {
    if (!data) return null;
    const model = new Employee(
      data.id,
      data.name,
      data.dob,
      data.street,
      data.city,
      data.state,
      data.phone
    );
    return model;
  }
};
