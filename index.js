const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// models
const Task = require('./models/Task')
const User = require('./models/User')

// import routes
const TasksRoutes = require('./routes/TaskRoutes');
const userRoutes = require('./routes/userRoutes');

// import controller
const TaskController = require("./controllers/TaskController");

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(express.json());

//session middleware
app.use(
    session({
        name: 'session',
        secret: 'bwem-yegn',
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
        },
    }),
)

// flash messages
app.use(flash());

app.use(express.static("public"));

// set session to res
app.use((req, res, next) => {

    if (req.session.userid) {
        res.locals.session = req.session;
    }

    next();
});

// Routes
app.use('/', TasksRoutes)
app.use('/user', userRoutes)

app.get('/', TaskController.home)

conn.sync({ force: false }).then(() => {
    app.listen(3000)
}).catch((error) => console.log(error))