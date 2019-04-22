const express = require('express')
const router = new express.Router()

const taskController = require('../app/Http/Controllers/taskController')
const auth = require('../app/Http/Middleware/authMiddleware')

router.get('/', auth, taskController.index)

router.get('/:id', auth, taskController.show)

router.post('/', auth, taskController.store)

router.delete('/:id', auth, taskController.destroy)

router.delete('/', auth, taskController.destroyAll)

module.exports = router