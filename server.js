require('dotenv').config({ path: `.env.local` });
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
const PORT = process.env.PORT;
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const auth = require('./routes/auth');
const index = require('./routes/index');

const csrfProtection = csrf({
    cookie: true
});

// set middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
// app.use(csrfProtection);
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');

// socket.io connection handler
io.on('connection', (socket) => {
    socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
});

// database connection
connectDB();

// routers
app.use('/', index);
app.use('/auth', auth);

// start server on given PORT
server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})