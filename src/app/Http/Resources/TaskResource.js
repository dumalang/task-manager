const Resource = require('resources.js')

class TaskResource extends Resource {
    toArray() {
        return {
            id: this._id,
            description: this.description,
            completed: Boolean(this.completed),
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
}

module.exports = TaskResource