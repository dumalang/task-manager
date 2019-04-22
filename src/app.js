require('./db/mongoose')

const express = require('express')
const hbs = require('express-hbs')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')
const webRouter = require('./routers/webRouter')

const app = express()

// Define paths for Express config
const path = require('path')
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and view location
app.engine('hbs', hbs.express4({
    partialsDir: partialsPath
}));
app.set('view engine', 'hbs')
app.set('views', viewsPath)
// hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Maintenance mode check
const maintenance = (process.env.APP_MAINTENANCE === 'true') || false
app.use((req, res, next) => {
    if (maintenance) {
        res.status(503).send('maintenance mode');
    }
    next()
})

app.use(express.json())

// Router
var apiV1Router = express.Router();
apiV1Router.use('/users', userRouter);
apiV1Router.use('/users/me/tasks', taskRouter);
app.use('/api/v1', apiV1Router);

app.use(webRouter)

module.exports = app
