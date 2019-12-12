const config = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../database/models').User;
const UserContact = require('../database/models').UserContact;
const Expence = require('../database/models').Expence;
const UserExpence = require('../database/models').UserExpence;

function login(req, res) {
    console.log(req.body.email);
    var userprofile;
    if (req.body.email && req.body.password) {
        return User.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        }).then(user => {
            if (!user)
                throw new Error('Authentication failed. User not found.');
            if (!bcrypt.compareSync(req.body.password || '', user.password))
                throw new Error('Authentication failed. Wrong password.');
            const payload = {
                email: user.email,
                id: user.id,
                time: new Date()
            };
            var token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: config.tokenExpireTime
            });
            userprofile = {
                name: user.name,
                email: user.email,
                phone: user.phone
            }
            return token;
        })
            .then(token => {
                res.send({
                    success: true,
                    profile: userprofile,
                    data: { token }
                });
            })
            .catch(err => {
                res.send({
                    success: false,
                    message: err.message //not the best error handling.
                    //for better error handling visit github repository, link provided below
                });
            });
    } else {
        res.send({
            success: false,
            message: "Email address and password is required"
            //for better error handling visit github repository, link provided below
        });
    }
}
function register(req, res) {
    if (req.body.email && req.body.name && req.body.phone && req.body.password) {
        var email = req.body.email;
        var name = req.body.name || "";
        var phone = req.body.phone || '';
        return User.findOne({ where: { email, isRegistrationCompleted: true } })
            .then(exists => {
                if (exists) {
                    return res.send({
                        success: false,
                        message: 'Registration failed. User with this email already registered.'
                    });
                } else {
                    return User.findOne({ where: { email, isRegistrationCompleted: false } })
                        .then(exists => {
                            if (exists) {
                                var user = {
                                    email: email,
                                    name: name,
                                    phone: phone,
                                    isRegistrationCompleted: true,
                                    password: bcrypt.hashSync(req.body.password, config.saltRounds)
                                };
                                return exists.update(user)
                                    .then(() => res.send({ success: true }))
                                    .catch((err) => res.send({ success: false, message: err }));
                            } else {
                                var nuser = {
                                    email: email,
                                    name: name,
                                    phone: phone,
                                    isRegistrationCompleted: true,
                                    password: bcrypt.hashSync(req.body.password, config.saltRounds)
                                };
                                return User.create(nuser)
                                    .then(() => res.send({ success: true }))
                                    .catch((err) => res.send({ success: false, message: err }));
                            }
                        })
                        .catch((error) => res.send({ success: false, message: error }));
                }
            })
            .catch((error) => res.send({ success: false, message: error.errors[0].message }));
    } else {
        res.send({ success: false, message: "All fields are mandatory" })
    }
}
function addContact(req, res) {
    var email = req.body.email;
    var name = req.body.name || "";
    var phone = req.body.phone || '';
    return User.findOne({ where: { email } })
        .then(nuser => {
            if (nuser) {
                return UserContact.create({ fkUserId: req.user.id, fkContactId: nuser.id })
                    .then(sucess => {
                        res.send({ success: true });
                    })
                    .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
            } else {
                var randompass = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                var ncuser = {
                    email: email,
                    name: name,
                    phone: phone,
                    isRegistrationCompleted: false,
                    password: bcrypt.hashSync(randompass, config.saltRounds)
                };
                return User.create(ncuser)
                    .then((guser) => UserContact.create({ fkUserId: req.user.id, fkContactId: guser.id }))
                    .then(() => res.send({ success: true }))
                    .catch((err) => res.send({ success: false, message: err }));
            }
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}
function getContacts(req, res) {
    return User.findByPk(req.user.id, {
        include: [{
            model: User,
            as: 'contacts',
            attributes: ['id', 'name', 'email', 'phone']
        }]
    })
        .then(user => {
            res.send(user.contacts);
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}
function updateProfile(req, res) {
    var name = req.body.name || "";
    var phone = req.body.phone || '';
    return User.findByPk(req.user.id)
        .then(user => {
            var updateuser = {
                name: name,
                phone: phone
            };
            if (req.body.password) {
                updateuser.password = bcrypt.hashSync(req.body.password, config.saltRounds);
            }
            return user.update(updateuser)
                .then(() => res.send({ success: true }))
                .catch((err) => res.send({ success: false, message: err }));
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}
function getExpences(req, res) {
    return User.findByPk(req.user.id, {
        include: [{
            model: UserExpence,
            as: 'expences',
            attributes: ['id', 'amount', 'fkExpenceId', 'fkPaidBy', 'isSetteledUp']
        }]
    })
        .then(user => {
            res.send(user);
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}
module.exports = {
    login,
    register,
    addContact,
    getContacts,
    updateProfile,
    getExpences
};