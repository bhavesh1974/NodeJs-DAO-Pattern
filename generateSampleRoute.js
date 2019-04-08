const express = require("express");
const router = express.Router();

const SampleController = require("../controller/sampleController");
const sampleController = new SampleController();

router.get("", sampleController.getAll());
router.get("/:id", sampleController.get());
router.post("", sampleController.add());
router.put("", sampleController.update());
router.delete("", sampleController.delete());

module.exports = router;
