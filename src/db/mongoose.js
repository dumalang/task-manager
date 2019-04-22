const mongoose = require('mongoose')

const protocol = process.env.DB_PROTOCOL || 'mongodb'
const host = process.env.DB_HOST || '127.0.0.1'
const port = process.env.DB_PORT || '27017'
const db = process.env.DB_NAME || ''
const username = process.env.DB_USERNAME || ''
const password = process.env.DB_PASSWORD || ''
var username_password = ''
var url = ''

if (username != '' && password != '') {
    username_password = username + ':' + password + '@'
}

switch (protocol) {
    case 'mongodb' :
        url = protocol + '://' + username_password + host + ':' + port + '/' + db
        break;
    case 'mongodb+srv' :
        url = protocol + '://' + username_password + host + '/' + db
}

const connection = mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

