const Task = require('../../Models/Task')
const TaskResource = require('../Resources/TaskResource')
const sharp = require('sharp')

const index = async (req, res) => {
    Task.find().then((data) => {
        res.send(data)
    }).catch(() => {
        res.status(500).send()
    })
}

const show = async (req, res) => {
    const id = req.params.id
    Task.findById(id).then((task) => {
        if (!task) {
            res.status(400).send()
        }
        res.send(task)
    }).catch(() => {
        res.status(500).send()
    })
}

const store = async (req, res) => {
    req.body.user_id = req.user._id
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(new TaskResource(task, true).exec())
    } catch (e) {
        res.status(400).send(e.message)
    }
}

const destroyAll = async (req, res) => {
    Task.deleteMany().then((data) => {
        res.send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
}

const destroy = async (req, res) => {
    const id = req.params.id
    Task.findByIdAndDelete(id).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
}

module.exports = {
    index,
    show,
    store,
    destroy,
    destroyAll
}