const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })  // check to see if username exists
    .first()
    .then(user => {
      // now compare input pwd with hashed pwd stored on database
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user; // add user info to the session - session id gets stored in the cookie
        res.status(200).json({ // in the res a cookies is sent with the encrypted session id on it
          message: `Welcome ${user.username}, have a cookie!`,
        }); // updated cookie is sent back with res
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('You can never leave!');
      } else {
        res.send('bye bye');
      }
    });
  } else {
    res.end();
  }
})

module.exports = router;
