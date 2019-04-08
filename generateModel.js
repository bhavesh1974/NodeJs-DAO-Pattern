var SequelizeAuto = require("sequelize-auto");
var fs = require("fs");

var auto = new SequelizeAuto("sample", "root", "admin", {
  host: "localhost",
  dialect: "mysql",
  port: 3306
});

function isTableExcluded(table) {
  if (table.indexOf("tablename") >= 0) {
    return true;
  }
  return false;
}

function isColumnExcluded(column) {
  if (column == "id") {
    return true;
  }
  return false;
}

function generateTableName(table) {
  newTable = table.substring(table.indexOf("_") + 1);
  generatedTable = "";
  nextUpper = false;
  for (char in newTable) {
    if (char == 0) {
      generatedTable = generatedTable + newTable[char].toUpperCase();
    } else {
      if (newTable[char] == "_") {
        nextUpper = true;
      } else {
        if (nextUpper) {
          generatedTable = generatedTable + newTable[char].toUpperCase();
          nextUpper = false;
        } else {
          generatedTable = generatedTable + newTable[char];
        }
      }
    }
  }
  return generatedTable;
}

function generateRoute(tables) {
  var template = "";
  template = fs.readFileSync("./generateSampleRoute.js", "utf8");
  for (table in tables) {
    if (isTableExcluded(table) == false) {
      var writeToFile = template;
      var tableName = generateTableName(table);
      var tableNameLower =
        tableName.substring(0, 1).toLowerCase() + tableName.substring(1);
      var fileName = tableNameLower + ".js";
      writeToFile = writeToFile.replace(
        /sampleController/g,
        tableNameLower + "Controller"
      );
      writeToFile = writeToFile.replace(
        /SampleController/g,
        tableName + "Controller"
      );
      fs.writeFile("./generated/routes/" + fileName, writeToFile, function(
        error
      ) {
        if (error) console.log(error);
      });
    }
  }
}

function generateDao(tables) {
  var template = "";
  template = fs.readFileSync("./generateSampleDao.js", "utf8");
  for (table in tables) {
    if (isTableExcluded(table) == false) {
      var writeToFile = template;
      var tableName = generateTableName(table);
      var tableNameLower =
        tableName.substring(0, 1).toLowerCase() + tableName.substring(1);
      var fileName = tableNameLower + "Dao.js";

      writeToFile = writeToFile.replace("SampleDao", tableName + "Dao");
      writeToFile = writeToFile.replace("sampleModel", tableNameLower);
      writeToFile = writeToFile.replace("tableName", table);
      writeToFile = writeToFile.replace("SampleModel", tableName);

      var mapToData = "";
      for (var property in tables[table]) {
        if (isColumnExcluded(property) == false) {
          mapToData = mapToData + "\t\t\tdata." + property + ",\n";
        }
      }
      writeToFile = writeToFile.replace(
        "SampleModel()",
        tableName + "(\n" + mapToData.substring(0, mapToData.length - 2) + "\n)"
      );
      fs.writeFile("./generated/dao/" + fileName, writeToFile, function(error) {
        if (error) console.log(error);
      });
    }
  }
}

function generateController(tables) {
  var template = "";
  template = fs.readFileSync("./generateSampleController.js", "utf8");

  for (table in tables) {
    if (isTableExcluded(table) == false) {
      var writeToFile = template;
      var tableName = generateTableName(table);
      var tableNameLower =
        tableName.substring(0, 1).toLowerCase() + tableName.substring(1);
      var fileName = tableNameLower + "Controller.js";

      writeToFile = writeToFile.replace(/SampleDao/g, tableName + "Dao");
      writeToFile = writeToFile.replace(/sampleDao/g, tableNameLower + "Dao");
      writeToFile = writeToFile.replace(
        /SampleController/g,
        tableName + "Controller"
      );
      var insertData = "";
      var updateData = "";
      var insertColumns = "";
      var insertValues = "";
      var updateSQL = "";
      var columnNo = 0;
      var updateColumnNo = 1;
      for (var property in tables[table]) {
        if (isColumnExcluded(property) == false) {
          if (columnNo > 0) {
            insertColumns = insertColumns + property + ",";
            insertData = insertData + "req.body." + property + ",";
            insertValues = insertValues + "?,";
            updateSQL = updateSQL + property + " = ?,";
          }
          updateData = updateData + "req.body." + property + ",";
          columnNo = columnNo + 1;
          updateColumnNo = updateColumnNo + 1;
        }
      }
      updateData = updateData + "req.body.id,";
      var insertSQL =
        "insert into " +
        table +
        "(" +
        insertColumns.substring(0, insertColumns.length - 1) +
        ") values (" +
        insertValues.substring(0, insertValues.length - 1) +
        ")";

      updateSQL = updateSQL.substring(0, updateSQL.length - 1);
      updateSQL = "update " + table + " set " + updateSQL + " where id = ?";
      writeToFile = writeToFile.replace(
        "insertSQL",
        insertSQL + " RETURNING id"
      );
      writeToFile = writeToFile.replace(
        "insertFields",
        insertData.substring(0, insertData.length - 1)
      );
      writeToFile = writeToFile.replace(
        "updateFields",
        updateData.substring(0, updateData.length - 1)
      );
      writeToFile = writeToFile.replace("updateSQL", updateSQL);

      fs.writeFile("./generated/controller/" + fileName, writeToFile, function(
        error
      ) {
        if (error) console.log(error);
      });
    }
  }
}

function generateModel(tables) {
  for (table in tables) {
    var writeToFile = "";
    var tableName = generateTableName(table);
    var fileName =
      tableName.substring(0, 1).toLowerCase() + tableName.substring(1) + ".js";
    if (isTableExcluded(table) == false) {
      writeToFile = "module.exports = class " + tableName + " {\n";
      var constructorDef = "";
      var fieldDef = "";
      for (var property in tables[table]) {
        if (isColumnExcluded(property) == false) {
          constructorDef = constructorDef + property + ",";
          fieldDef = fieldDef + "\t\tthis." + property + "=" + property + ";\n";
        }
        //console.log(property);
        //console.log(auto.tables[table][property].type.toLowerCase());
      }
      writeToFile =
        writeToFile +
        "\tconstructor(" +
        constructorDef.substring(0, constructorDef.length - 1) +
        ") {\n";

      writeToFile = writeToFile + fieldDef;
      writeToFile = writeToFile + "\t}\n}";

      fs.writeFile("./generated/model/" + fileName, writeToFile, function(
        error
      ) {
        if (error) console.log(error);
      });
    }
  }
}

auto.run(function(err) {
  if (err) throw err;

  if (!fs.existsSync("./generated")) {
    fs.mkdirSync("./generated");
  }
  if (!fs.existsSync("./generated/model")) {
    fs.mkdirSync("./generated/model");
  }
  if (!fs.existsSync("./generated/controller")) {
    fs.mkdirSync("./generated/controller");
  }
  if (!fs.existsSync("./generated/dao")) {
    fs.mkdirSync("./generated/dao");
  }
  if (!fs.existsSync("./generated/routes")) {
    fs.mkdirSync("./generated/routes");
  }

  generateModel(auto.tables);
  generateController(auto.tables);
  generateDao(auto.tables);
  generateRoute(auto.tables);
});
