const groupsController = require('../../controllers').groups;
const authController = require('../../controllers').auth;
const router = require("express").Router();

router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the Groups API!'
}));

router.post('/list',authController.checkAuth, groupsController.list);
router.post('/create',authController.checkAuth, groupsController.create);
router.post('/addUsers/:id', authController.checkAuth, groupsController.addUsers);
router.post('/details/:id',authController.checkAuth, groupsController.details);
router.post('/addExpence/:id', authController.checkAuth, groupsController.addExpence);
router.post('/getExpences/:id', authController.checkAuth, groupsController.getExpences);

module.exports = router;