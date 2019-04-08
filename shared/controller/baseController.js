module.exports = class BaseController {
  constructor(dao, insertSQL, updateSQL) {
    this.dao = dao;
    this.insertSQL = insertSQL;
    this.updateSQL = updateSQL;
  }

  get() {
    return (req, res, next) => {
      this.dao
        .findById(req.params.id)
        .then(data => {
          res.json({
            code: 200,
            results: data
          });
        })
        .catch(error => {
          logger.error(__filename + " > get", error);
          throw error;
        });
    };
  }

  getAll() {
    return (req, res, next) => {
      this.dao
        .findAll()
        .then(data => {
          res.status(200).json({
            code: 200,
            results: data
          });
        })
        .catch(error => {
          logger.error(__filename + " > getAll", error);
          throw error;
        });
    };
  }

  validateAdd(req) {
    return "";
  }
  buildAddModel(req) {
    return [];
  }
  add() {
    return (req, res, next) => {
      const validationError = this.validateAdd(req);
      if (validationError != "") {
        res.status(400).send(validationError);
      }
      const data = this.buildAddModel(req);
      this.dao
        .add(this.insertSQL, data)
        .then(result => {
          res.status(200).json({
            code: 200,
            message: "It is successfully added.",
            id: result.insertId
          });
        })
        .catch(error => {
          logger.error(__filename + " > save", error);
          throw error;
        });
    };
  }

  validateUpdate(req) {
    return "";
  }
  buildUpdateModel(req) {
    return [];
  }
  update() {
    return (req, res, next) => {
      const validationError = this.validateUpdate(req);
      if (validationError != "") {
        res.status(400).send(validationError);
      }
      const data = this.buildUpdateModel(req);
      this.dao
        .update(this.updateSQL, data)
        .then(result => {
          res.status(200).json({
            code: 200,
            message: "It is successfully updated."
          });
        })
        .catch(error => {
          logger.error(__filename + " > update", error);
          throw error;
        });
    };
  }

  delete() {
    return (req, res, next) => {
      this.dao
        .delete(req.params.id)
        .then(data => {
          res.json({
            code: 200,
            message: "It is successfully deleted."
          });
        })
        .catch(error => {
          logger.error(__filename + " > delete", error);
          throw error;
        });
    };
  }
};
