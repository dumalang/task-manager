const jwt = require('jsonwebtoken')
const User = require('../../Models/User')

const jwtSecret = process.env.JWT_SECRET

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedData = jwt.verify(token, jwtSecret)
        const user = await User.findById({_id: decodedData._id, 'tokens.token': token})
        if (!user) {
            throw Error('Unauthorized!')
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send(e)
    }
}

module.exports = authMiddleware