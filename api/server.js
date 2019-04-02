const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');

const server = express();

const sessionOptions = {
  name: 'DrWho',   // to disguise the cookie, else the name is connect.sid which is a clue to hackers of our stack
  secret: 'I am not who you think I am', // usually stored as an environment variable and not as plain text here
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false, // set to true if https is being used
  },
  httpOnly: true, // keeps js from being able to access - this is a security setting
  resave: false, // if there is no change, do not resave
  saveUninitialized: false,  // to abide by GDPR laws

  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'), // db info
    tablename: 'sessions',
    sidfieldname: 'sid',
    createTable: true, // if table doesn't exist, create it
    clearInterval: 1000 * 60 * 60, // clear out inactive sessions hourly
  })
}

server.use(session(sessionOptions));
server.use(express.json());
server.use(helmet());
server.use(cors());

server.use('/api/auth', authRouter)
server.use('/api/users', usersRouter)

server.get("/", (req, res) => {
  res.send("I am Son of Hal ... I am always watching!");
});

module.exports = server;
