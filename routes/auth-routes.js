const express = require('express');
const mongoose = require('mongoose');
const authRoutes = express.Router();

const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');


//POST - /auth/login - username, password - User logged
authRoutes.post('/login', (req, res, next) => {
    const {username, password} = req.body;

    User.findOne({username})
    .then(user => {
        if (!user) {
            return next(new Error('No user with that email'))
        }

        //compareSync
        if (bcryptjs.compareSync(password, user.password) !== true) {
            return next(new Error('Wrong credentials'))
        } else {
            req.session.currentUser = user
            res.json(user)
        }
    })
    .catch(next)
})


//POST - /auth/signup - username, password, campus, course - User created
authRoutes.post('/signup', (req, res, next) => {
    const {username, password, campus, course} = req.body;

    if (!username || !password) {
        res.status(400).json({message: 'Provide username and password'});
        return;
    }

    if (password.length < 7) {
        res.status(400).json({message: 'Please make your password at least 8 characters long for security purposes.'})
    }

    User.findOne({username})
    .then(foundUser => {
        if (foundUser) {
            res.status(400).json({message:'Username taken. Choose another one'});
            return;
        }

        const salt     = bcryptjs.genSaltSync(10);
        const hashPass = bcryptjs.hashSync(password, salt);

        const newUser = new User({
            username,
            password: hashPass,
            campus,
            course
        })

        newUser.save()
        .then(() => {
            console.log('toto')
            //persist our new user into session
            req.session.currentUser = newUser

            res.status(200).json(newUser)
        })
        .catch(err => {
            res.status(400).json({message:'Saving user to database went wrong.'})
        })
    })
    .catch(err => {
        res.status(500).json({message: 'Username check went bad.'})
    })
})


//POST - /auth/upload - file - User updated



//POST - /auth/edit - username, campus, course - User updated



//POST - /auth/logout - OK message


//GET - /auth/loggedin - User logged

authRoutes.get('/auth/loggedin', (req, res) => {
    res.render('users/user-profile', {userInSession: req.session.currentUser})
})





module.exports = authRoutes;