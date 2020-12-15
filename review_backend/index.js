const express = require('express');
const bodyParser = require('body-parser');
const login = require('./routes/login/login.routing.js');
const review = require('./routes/review/review.routing');
const session = require('./routes/session/session.routing');
const template = require('./routes/template/template.routing');
const notification = require('./routes/notification/notification.routing');
const user = require('./routes/user/user.routing');
const errorHandle = require('./utils/errorHandle');
const app = express();
const middleware = require('./utils/middleware');
const cors = require('cors');
const schedulers = require('./utils/schedulers');
const cron = require('node-cron');
const sessionNameValidator = require('./utils/nameValidator.action');
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
cron.schedule('1 0 0 * * *', function () {
    schedulers.activateSession.call(this);
    schedulers.deactivateSession.call(this);
    schedulers.sendMailNotification.call(this);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options('*', cors());

app.use("/login", login);

app.use("*", middleware.checkToken);
app.use("/review", review);
app.use("/session", session);
app.use("/template", template);
app.use("/user", user);
app.use("/notification", notification);
app.use("/nameValidation", sessionNameValidator);

app.use(function (error, req, res, next) {
    res.status(error.status || 500)
        .json({
            error: errorHandle(error),
            code: error.code
        });
});

app.listen(3000);


//for live notifications
let http = require('http');
let server = http.Server(app);
let socketIO = require('socket.io');
let io = socketIO(server);


io.on('connection', (socket) => {
    socket.on('new-message', (message) => {
        setTimeout(() => io.emit('new-message', message), 3000);
    });
});

server.listen(3001, () => {
});