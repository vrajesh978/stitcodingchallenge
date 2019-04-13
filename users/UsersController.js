const express = require('express');
const router = express.Router();
const userService = require('./UserService');

// routes
router.post('/login', authenticate);
router.post('/register', register);
router.get('/current', getCurrent);
router.put('/setPreferences/:id', update);
router.get('/getEvent', getEvent);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({message:"User is added to database"}))
        .catch(err => next(err));
}



function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}


function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({message:"user has setPreferences"}))
        .catch(err => next(err));
}

function getEvent(req,res,next){
    userService.getEvent(req.user.sub).then(events => events ? res.json(events) : res.sendStatus(404))
        .catch(err=> next(err));
}