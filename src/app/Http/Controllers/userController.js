const User = require('../../Models/User')

const UserResource = require('../Resources/UserResource')
const TaskResource = require('../Resources/TaskResource')
const Paginator = require('../../Utils/Paginator')
const EmailService = require('../../Services/EmailService/EmailService')

const sharp = require('sharp')

const index = async (req, res) => {
    try {
        const users = await User.find({}).select("-avatar")
        res.send(UserResource.collection(users, true))
    } catch (e) {
        res.status(500).send(e.stack)
    }
}

const showMe = async (req, res) => {
    try {
        const user = req.user
        res.send(new UserResource(user, true).exec())
    } catch (e) {
        res.status(500).send(e)
    }
}

const show = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (!user) {
            res.status(404).send()
        }
        res.send(new UserResource(user, data).exec())
    } catch (e) {
        res.status(500).send(e)
    }
}

const store = async (req, res) => {
    var {body} = req
    try {
        const emailService = new EmailService(
            body.email,
            "This is Subject",
            "This is text",
            "<p>This is paragraph</p>"
        )
        emailService.send()
        const user = new User(body)
        await user.save()
        const token = await user.generateAuthToken()
        user.token = token
        res.status(201).send(new UserResource(user, true).exec())
    } catch (e) {
        res.status(400).send(e.message)
    }
}

const update = async (req, res) => {
    const id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password']
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
        res.status(400).send({error: 'Invalid updates!'})
    }
    try {
        var user = req.user;
        if (!req.user) {
            user = await User.findById(id)
        }
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        if (!user) {
            res.status(400).send()
        }
        res.send(new UserResource(user, true).exec())
    } catch (e) {
        res.status(500).send(e.stack)
    }
}

const destroyMe = async (req, res) => {
    try {
        const user = await req.user.remove()
        res.send(new UserResource(user, true).exec())
    } catch (e) {
        res.status(500).send(e.stack)
    }
}

const destroy = async (req, res) => {
    const id = req.params.id
    try {
        const user1 = await User.findById(id)
        const user2 = await User.findByIdAndDelete(user1._id)
        res.send(new UserResource(user2, true).exec())
    } catch (e) {
        res.status(400).send(e.stack)
    }
}

const login = async (req, res) => {
    const {body} = req
    const email = body.email
    const password = body.password
    try {
        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken()
        user.token = token
        res.send(new UserResource(user, true).exec())
    } catch (e) {
        res.status(400).send({
            message: e.message
        })
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

const logoutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
}

const getTasks = async (req, res) => {
    const user = req.user

    var match = {}
    var options = {}
    var perPage = 5;
    var page = 1;

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.per_page) {
        perPage = Number(req.query.per_page)
        options.limit = perPage
    }
    if (req.query.page) {
        page = Number(req.query.page)
        page = page <= 0 ? 1 : page
        options.skip = (page - 1) * perPage
    }

    if (req.query.sort_by) {
        const sortBy = req.query.sort_by
        var sortByArr = sortBy.split(",")
        var sortField = sortByArr[0]
        var sortDirection = sortByArr[1] === 'desc' ? -1 : 1
        var sort = {}
        sort[sortField] = sortDirection
        options.sort = sort
    }

    await user.populate({
        path: 'tasks',
        match,
        options
    }).execPopulate()

    await user.populate({
        path: 'taskCount',
        match
    }).execPopulate()

    const paginator = new Paginator(user.tasks, page, perPage, user.taskCount, req);

    res.send(TaskResource.collection(paginator, true))

}

const uploadAvatar = async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}

const showAvatar = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (user) {
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }
    res.send()
}

module.exports = {
    index,
    showMe,
    show,
    store,
    update,
    destroyMe,
    destroy,
    login,
    logout,
    logoutAll,
    getTasks,
    uploadAvatar,
    showAvatar
}