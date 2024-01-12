const express = require('express')
const router = express.Router()
const TaskController = require('../controllers/TaskController')

router.get("/", TaskController.home)
router.post("/submit", TaskController.createTask)
router.post("/del/:id", TaskController.delTask)
router.post("/toggleType/:id", TaskController.toggleTask)
router.post("/finished/:id", TaskController.doTask)

module.exports = router