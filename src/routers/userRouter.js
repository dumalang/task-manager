const express = require('express')
const router = new express.Router()

const userController = require('../app/Http/Controllers/userController')
const auth = require('../app/Http/Middleware/authMiddleware')
const upload = require('../app/Utils/upload')

const createUserRequest = require('../app/Http/Requests/user/createUserRequest')

router.get('/', auth, userController.index)

router.get('/me', auth, userController.showMe)

router.get('/:id', auth, userController.show)

router.post('/', createUserRequest, userController.store)

router.patch('/me', auth, userController.update)

router.patch('/:id', auth, userController.update)

router.delete('/me', auth, userController.destroyMe)

router.delete('/:id', userController.destroy)

router.post('/login', userController.login)

router.post('/logout', auth, userController.logout)

router.post('/logout-all', auth, userController.logoutAll)

router.get('/me/tasks', auth, userController.getTasks)

router.post('/me/avatar', auth, upload.avatar, userController.uploadAvatar, (err, req, res, next) => {
    res.status(400).send({error: err.message})
})

router.get('/:id/avatar', userController.showAvatar, (err, req, res, next) => {
    res.status(400).send({error: err.message})
})

module.exports = router