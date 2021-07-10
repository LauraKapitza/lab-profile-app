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
            res.status(400).json({message: 'No user with that username'})
            return next(new Error('No user with that username'))
        }

        //compareSync
        if (bcryptjs.compareSync(password, user.password) !== true) {
            res.status(400).json({message: 'Wrong credentials'})
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
            res.status(409).json({message:'Username taken. Choose another one'});
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
authRoutes.post('/upload', (req, res, next) => {
    const imageUrl = req.body.imageUrl;
    const userId = req.session.currentUser;

    if (!userId) {
        res.status(401).json({message: 'You need to be logged-in to create a project'});
        return;
    }

    User.findByIdAndUpdate(userId._id, {imageUrl: imageUrl})
    .then(user => {
        res.status(200).json({message:'Image was successfully uploaded'})
    })
    .catch(err => {
        res.status(500).json({message:'Error occures while checking username'})
    })
})


//POST - /auth/edit - username, campus, course - User updated
authRoutes.post('/edit', (req, res, next) => {
    const {username, password, campus, course} = req.body;
    const userId = req.session.currentUser

    if (!userId) {
        res.status(401).json({message: 'You need to be logged-in to create a project'});
        return;
    }

    User.findByIdAndUpdate(userId._id, {username, password, campus, course})
    .then(user => {
        res.status(200).json({message:'Image was successfully uploaded'})
    })
    .catch(err => {
        res.status(500).json({message:'Error occures while checking username'})
    })
})


//POST - /auth/logout - OK message
authRoutes.post('/logout', (req, res, next) => {
    req.session.destroy()
    res.json({message:'You are now logged out.'})
})

//GET - /auth/loggedin - User logged
authRoutes.get('/loggedin', (req, res) => {
    if (req.session.currentUser) {
        res.status(200).json(req.session.currentUser);
        return;
    }
    res.status(403).json({message:'Unauthorized'})
})

module.exports = authRoutes;