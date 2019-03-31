1. yarn
2. npm init -y - add "server": "nodemon index.js" to startup scripts in package.json file
3. add dependencies express, knex, sqlite3, cors, & bcryptjs
4. yarn add nodemon -d
5. create /data directory for database
6. knex init to create knexfile.js - set up file to work with sqlite3 and database, set migrations/seeds path
7. set up users table - knex migrate:make createUsersTable - set up code to define table
8. Run knex migrate:latest to create table - check in sqlite3Studio to ensure created properly.
9. create users directory and create users-model.js file for helper functions
10. Create a db constant in server.js that requires the users-model.js file path:

    const db = require('./users/users-model.js)

11. build helper functions: addUser(), findBy(), addAction(projectID), find()
12. build API endpoints to register a user, log in a user, and, once logged in, get a list of users

13. Test endpoints in postman

14. add express-session library
15. add to server.js:

  const session = require('express-session')

16. create a sessionConfig (sessionOptions) file in server.js

  // every time a new session is created, it will use the secret below to encrypt the session id
  const sessionOptions = {
    name: 'AlienRift',   // to disguise the cookie, else the name is connect.sid which is a clue to hackers of our stack
    secret: 'I like nice butts and I cannot lie', // usually stored as an environment variable and not as plain text here. This is the session password and is the key to encrypting and decrypting the session cookie.  Everytime the server recieves a cookie, it uses the secret to decrypt and then encrypt cookies, starting with the info below:
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false, // set to true if https is being used
    },
    httpOnly: true, // keeps js from being able to access - this is a security setting
    resave: false, // if there is no change, do not resave
    saveUninitialized: false
  }

  17. Initialize session:

    server.use(session(sessionConfig)); // place before routes

    this creates a session object on the server and uses the sessionConfig info to seed that object.  It also now puts that object on req.session

  18. In auth-router.js in the login route, add the user info to the session object, which creates a new session with the user info passed into it.  It creates a session id and a cookie that req below
  sends out

    req.session.user = user

    add this line of code right after the bcrypt password comparison since, if the passwords check out, then we can create a new session cookie here which gets passed back with res.

  19. Now that req.session contains the session info (user info), we can use that req.session info to set up our restricted-middleware.js function:

    const bcrypt = require('bcryptjs');

    const Users = require('../users/users-model.js');

    module.exports = (req, res, next) => {
      if (req.session && req.session.user) { // if user is on the session
        next();
      } else {
        res.status(401).json({ message: 'you shall not pass!' });
      }
    };

  20. create logout route in auth-router.js

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

  21. yarn add connect-session-knex to install library which will enable saving of the session to the database

  22. In server.js right after requiring the session require:

    const KnexSessionStore = require('connect-session-knex')(session)

    This passes the session handling over to the database for storage

  23. add store to the sessionOptions object:

    store: new KnexSessionStore({
      knex: require('../database/dbConfig.js'),
      tablename: 'sessions',
      sidfieldname: 'sid',
      createTable: true, // if table doesn't exist, create it
      clearInterval: 1000 * 60 * 60, // clear out inactive sessions hourly
    })