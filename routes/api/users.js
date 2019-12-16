const usersController = require('../../controllers').users;
const authController = require('../../controllers').auth;
const router = require("express").Router();

router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the Users API!'
}));
router.post('/', (req, res) => res.status(200).send({
    message: 'Welcome to the Users API!'
}));
router.post('/login', usersController.login);
router.post('/register', usersController.register);
router.post('/addContact', authController.checkAuth, usersController.addContact);
router.post('/getContacts', authController.checkAuth, usersController.getContacts);
router.post('/updateProfile', authController.checkAuth, usersController.updateProfile);
router.post('/getExpences', authController.checkAuth, usersController.getExpences);
router.post('/settleExpences/:id', authController.checkAuth, usersController.settleExpences);

module.exports = router;