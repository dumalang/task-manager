const Resource = require('resources.js')
const TokenResource = require('./TokenResource')

class UserResource extends Resource {
    toArray() {
        var data = {
            id: this._id,
            name: this.name,
            email: this.email,
            age: this.age,
            tokens: TokenResource.collection(this.tokens),
            token: this.token
        }

        return data
    }
}

module.exports = UserResource