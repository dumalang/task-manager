const request = require('supertest')
const app = require('../src/app')
const User = require('../src/app/Models/User')

const {
    userOneId,
    userOne,
    userTwo,
    setupDatabase
} = require('./fixtures/db.js')

beforeEach(async () => {
    await setupDatabase()
})

const urlResource = '/api/v1/users'

test('Should sign up user!', async () => {
    const res = await request(app)
        .post(urlResource)
        .send(userTwo)
        .expect(201)

    // Assert the user was inserted correctly
    const user = await User.findById(res.body.data.id)
    expect(user).not.toBeNull()

    // Assertion about the response
    expect(res.body).toMatchObject({
        data: {
            name: userTwo.name,
            email: userTwo.email
        }
    })
    expect(res.body.data.email).toBe(userTwo.email)

    // Assertion for password encryption
    expect(user.password).not.toBe(userTwo.password)
})

test('Should login existing user!', async () => {
    const {email, password} = userOne;
    const res = await request(app)
        .post(urlResource + '/login')
        .send({email, password})
        .expect(200)

    const user = await User.findById(userOneId);
    expect(res.body.data.token).toBe(user.tokens[1].token)
})

test('Should fail to sign up user because duplicate email!', async () => {
    await request(app)
        .post(urlResource)
        .send(userOne)
        .expect(400)
})

test('Should not login nonexistent user!', async () => {
    await request(app)
        .post(urlResource + '/login')
        .send(userTwo)
        .expect(400)
})

test('Should get profile for user!', async () => {
    await request(app)
        .get(urlResource + '/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for user!', async () => {
    await request(app)
        .get(urlResource + '/me')
        .send()
        .expect(401)
})

test('Should delete account for user!', async () => {
    const res = await request(app)
        .delete(urlResource + '/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user).toBeNull()
})

test('Should not delete account for unauthenticate user!', async () => {
    await request(app)
        .delete(urlResource + '/me')
        .send()
        .expect(401)

    const user = await User.findById(userOne._id)
    expect(user).not.toBeNull()
})

test('Should upload avatar image!', async () => {
    await request(app)
        .post(urlResource + '/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/portgasdace.jpg')
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields!', async () => {
    await request(app)
        .patch(urlResource + '/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            age: 12,
            name: 'ganteng'
        })
        .expect(200)

    const user = await User.findById(userOne._id)
    expect(user.name).toEqual('ganteng')

})