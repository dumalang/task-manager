const Resource = require('resources.js')

class TokenResource extends Resource {
    toArray() {
        return {
            id: this._id,
            token: this.token
        }
    }
}

module.exports = TokenResource