const express = require('express')
const router = express.Router()
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const userControl = require('../controller/user')


router.route('/register')
    .get(userControl.signUpFrom)
    .post( userControl.signUp)

router.route('/login')
    .get( userControl.signInFrom)
    .post(storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),userControl.signIn);

router.get('/logout', userControl.logout); 



module.exports = router

