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
