const BaseDao = require("../shared/dao/baseDao");
const SampleModel = require("../model/sampleModel");

module.exports = class SampleDao extends BaseDao {
  constructor() {
    super("tableName");
  }
  mapDataToModel(data) {
    if (!data) return null;
    const model = new SampleModel();
    return model;
  }
};
