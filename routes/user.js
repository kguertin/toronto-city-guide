const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const isAuth = require('../middleware/isAuth');

router.post('/getActiveUser', isAuth, userController.getActiveUser)

router.post('/findUser', isAuth, userController.findUser)

router.post('/addContact', isAuth, userController.addContact)

router.delete('/removeContact', isAuth, userController.removeContact);

router.post('/addFavourite', isAuth, userController.addFavourite)

router.post('/removeFavourite', isAuth, userController.removeFavourite)

router.post('/getUserMessages', isAuth, userController.getUserMessages);

router.post('/updateUserMessages', isAuth, userController.updateUserMessages)

router.get('/getFavourites', isAuth, userController.getFavourites)


module.exports = router