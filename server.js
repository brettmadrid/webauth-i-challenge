const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./users/users-model');

const Users = require('./users/users-model.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

//server.use('/api/register', registerRouter)
//server.use('/api/login', loginRouter)

server.get('/', (req, res) => {
  res.send("It's alive!");
});

server.post('/api/register', (req, res) => {
  const user = req.body;

  // hash the user's password
  const hash = bcrypt.hashSync(user.password, 12);

  // now replace the user's text password with the hashed version
  user.password = hash;

  Users.add(user)
  .then(saved => {
    res.status(201).json(saved)
  })
  .catch(error => {
    res.status(500).json(error)
  })
})

module.exports = server;