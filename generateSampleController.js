const BaseController = require("../shared/controller/baseController");
const SampleDao = require("../dao/sampleDao");

module.exports = class SampleController extends BaseController {
  constructor() {
    const dao = new SampleDao();
    super(dao, `insertSQL`, `updateSQL`);
  }

  validateAdd(req) {
    return "";
  }
  buildAddModel(req) {
    return [insertFields];
  }

  validateUpdate(req) {
    return "";
  }
  buildUpdateModel(req) {
    return [updateFields];
  }
};
