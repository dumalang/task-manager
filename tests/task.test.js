const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/app/Models/Task')

const {
    userOneId,
    userOne,
    userTwo,
    setupDatabase
} = require('./fixtures/db.js')

beforeEach(async () => {
    await setupDatabase()
})

const taskOne = {
    description : "Learn express",
    completed: true
}

const urlResource = '/api/v1/users/me/tasks'

test('Should create new task!', async () => {
    const res = await request(app)
        .post(urlResource)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send(taskOne)
        .expect(201)

    const task = await Task.findById(res.body.data.id)
    expect(task).not.toBeNull()
})