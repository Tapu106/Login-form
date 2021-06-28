const express = require("express");
const router = express.Router();

const userController = require("../controller/user");

router.get("/success", userController.getHome);

module.exports = router;
