const db = require("../../config/db");
class BaseDao {
  constructor(tableName) {
    this.tableName = tableName;
  }

  mapDataToModel(data) {}
  retrieve(sql, data, multiple = false) {
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, result) => {
        if (error) {
          reject(error);
        } else {
          let resultData;

          if (multiple == false) {
            resultData = result[0];
            if (resultData) {
              const records = this.mapDataToModel(resultData);
              resolve(records);
            } else {
              resolve(undefined);
            }
          }

          resultData = result;
          if (resultData) {
            let records = [];
            for (let resultRecord in resultData) {
              records[resultRecord] = this.mapDataToModel(
                resultData[resultRecord]
              );
            }
            resolve(records);
          }
        }
      });
    });
  }

  findAll() {
    const sql = "select * from " + this.tableName;
    return this.retrieve(sql, null, true);
  }

  findById(id) {
    const sql = "select * from " + this.tableName + " where id = ?";
    const data = [id];
    return this.retrieve(sql, data, false);
  }

  update(updateSQL, data) {
    return new Promise((resolve, reject) => {
      db.query(updateSQL, data, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  add(insertSQL, data) {
    return new Promise((resolve, reject) => {
      db.query(insertSQL, data, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const sql = "delete from " + this.tableName + " where id = $1";
      const data = [id];

      db.query(sql, data, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }
}

module.exports = BaseDao;
