const validator = require('validator')
const ValidatorJS = require('validatorjs')
const User = require('../../../Models/User')

const authorize = async (req, res, next) => {
    var {body} = req

    ValidatorJS.registerAsync('exists', async (email, attribute, req, passes) => {
        const findUser = await User.findOne({
            email: email
        }).select("_id");

        if (findUser) {
            passes(false)
        }

        passes()
    })

    let validation = new ValidatorJS(body, rules(), messages());

    validation.fails(() => {
        res.status(422).send(validation.errors)
    })

    validation.passes(() => {
        next()
    });
}

const rules = () => {
    return {
        name: 'max:32',
        password: 'min:3',
        email: 'exists'
    }
}

const messages = () => {
    return {
        "max.name": ":attribute can't be more than :max character(s)!",
        "min.password": ":attribute must be more than :min character(s)!",
        "exists.email": ":attribute has been taken!"
    }
}

module.exports = authorize
