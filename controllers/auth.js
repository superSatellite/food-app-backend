const express = require('express');
const md5 = require('md5');

const onlyLoggedIn = require('../lib/only-logged-in');

module.exports = (dataLoader) => {
  const authController = express.Router();


//NOTE: When returned from request, property avatarURL is listed last, ask TA. (objects are not supposed to have an order)

  // Create a new user (signup)
  authController.post('/users', (req, res) => {
    
    console.log(req.body, "req.body");
    
    dataLoader.createUser({
      email: req.body.email,
      password: req.body.password
    })
    .then(user => res.status(201).json(user[0]))
    .catch(err => {
      console.log(err, "400 error");
      return res.status(400).json({"errors":{"email":["This email is already in use."]}})
    });
    
  });


  // Create a new session (login)
  authController.post('/sessions', (req, res) => {
    dataLoader.createTokenFromCredentials(
      req.body.email,
      req.body.password
    )
    .then(token => res.status(201).json({ token: token }))
    .catch(err => res.status(401).json(err));
  });


  // Delete a session (logout)
  authController.delete('/sessions', onlyLoggedIn, (req, res) => {
    if (req.sessionToken) {
      dataLoader.deleteToken(req.sessionToken)
    .then(() => res.status(204).end())
      .catch(err => res.status(400).json(err));
    } else {
      res.status(401).json({ error: 'Invalid session token' });
    }
  });


//NOTE: Retrieve current user (MUST PASS A TOKEN AS req.header.authorization!) Ex:
//Authorization -> token gDjkDqOUVKIYUN2VwJAzzgSC6LMfuj4qABDZ80TXR1tnXH54m+6wg9aBNh9gSnY9pBo=
//Content-Type: application.json
 
  authController.get('/me', onlyLoggedIn, (req, res) => {

    console.log(req.sessionToken, "req.sessionToken ");

    if (req.sessionToken) {
      dataLoader.getUserFromSession(req.sessionToken)
      .then(result => {
        return {
          "id": result.users_id,
          "email": result.users_email,
          "users_createdAt": result.users_createdAt,
          "users_updatedAt": result.users_updatedAt
        }
      })
      .then(user => {
        var hash = md5(user.email);
        var url = `https://www.gravatar.com/avatar/${hash}`;
        user.avatarUrl = url;
        res.status(200).json(user);
      })
    }
    else {
      res.status(401).json({ error: 'Invalid session token' });
    }
  });

  return authController;
};