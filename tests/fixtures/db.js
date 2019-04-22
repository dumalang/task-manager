const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/app/Models/User')

const userOneId = new mongoose.Types.ObjectId

const userOne = {
    _id: userOneId,
    name: 'justitia',
    email: 'justitia@mailinator.com',
    password: '123456',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

const userTwo = {
    name: 'jimmy',
    email: 'jimmydumalang@gmail.com',
    password: '123456'
}

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    setupDatabase
}