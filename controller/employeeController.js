const BaseController = require("../shared/controller/baseController");
const EmployeeDao = require("../dao/employeeDao");

module.exports = class EmployeeController extends BaseController {
  constructor() {
    const dao = new EmployeeDao();
    super(
      dao,
      `insert into employee(name,dob,street,city,state,phone) values (?,?,?,?,?,?)`,
      `update employee set name = ?,dob = ?,street = ?,city = ?,state = ?,phone = ? where id = ?`
    );
  }

  validateAdd(req) {
    return "";
  }
  buildAddModel(req) {
    return [
      req.body.name,
      req.body.dob,
      req.body.street,
      req.body.city,
      req.body.state,
      req.body.phone
    ];
  }

  validateUpdate(req) {
    return "";
  }
  buildUpdateModel(req) {
    return [
      req.body.name,
      req.body.dob,
      req.body.street,
      req.body.city,
      req.body.state,
      req.body.phone,
      req.body.id
    ];
  }
};
