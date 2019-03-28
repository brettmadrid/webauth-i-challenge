const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./users/users-model");

const Users = require("./users/users-model.js");

const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());

//server.use('/api/register', registerRouter)
//server.use('/api/login', loginRouter)

server.get("/", (req, res) => {
  res.send("It's alive!");
});

// middleware function to validate a user
function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: "Invalid credentials!" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: "Houston, we have a problem!" });
      });
  } else {
    res.status(400).json({ message: "Credentials not provided!" });
  }
}

server.post("/api/register", (req, res) => {
  const user = req.body;

  // hash the user's password
  const hash = bcrypt.hashSync(user.password, 12);

  // now replace the user's text password with the hashed version
  user.password = hash;

  // using the users-model.js helper file, add new user to the database
  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

server.get("/api/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => res.send(err));
});

module.exports = server;
