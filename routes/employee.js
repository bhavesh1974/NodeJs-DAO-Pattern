const express = require("express");
const router = express.Router();

const EmployeeController = require("../controller/employeeController");
const employeeController = new EmployeeController();

router.get("", employeeController.getAll());
router.get("/:id", employeeController.get());
router.post("", employeeController.add());
router.put("", employeeController.update());
router.delete("", employeeController.delete());

module.exports = router;
