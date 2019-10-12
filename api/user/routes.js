const express = require('express');
const userController = require('./controllers');

const router = express.Router();


router.get('/user/publications', userController.getUserPublications);
router.post('/user/login', userController.loginUser);
router.post('/user/logout', userController.logOutUser);

module.exports = router;
