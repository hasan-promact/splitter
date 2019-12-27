import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as config from "../config";


import { Expence } from "../database/models/expence";
import { User } from "../database/models/user";
import { Group } from "../database/models/group";
import { UserExpence } from "../database/models/userexpence";
import { UserGroup } from "../database/models/usergroup";
import { UserContact } from "../database/models/usercontact";

export function login(req: any, res: any): Promise<any> {
    let userprofile: any;
    if (req.body.email && req.body.password) {
        return User.findOne({
            where: {
                email: req.body.email
            },
            raw: true
        }).then((user: User) => {
            if (!user) {
                throw new Error("Authentication failed. User not found.");
            }
            if (!bcrypt.compareSync(req.body.password || "", user.password)) {
                throw new Error("Authentication failed. Wrong password.");
            }
            const payload = {
                email: user.email,
                id: user.id,
                time: new Date()
            };
            const token = jwt.sign(payload, config.jwtSecret, {
                expiresIn: config.tokenExpireTime
            });
            userprofile = {
                name: user.name,
                email: user.email,
                phone: user.phone
            };
            return token;
        })
            .then((token: any) => {
                res.send({
                    success: true,
                    profile: userprofile,
                    data: { token }
                });
            })
            .catch((err: any) => {
                res.send({
                    success: false,
                    message: err.message // not the best error handling.
                    // for better error handling visit github repository, link provided below
                });
            });
    } else {
        res.send({
            success: false,
            message: "Email address and password is required"
            // for better error handling visit github repository, link provided below
        });
    }
}
export function register(req: any, res: any) {
    if (req.body.email && req.body.name && req.body.phone && req.body.password) {
        const email = req.body.email;
        const name = req.body.name || "";
        const phone = req.body.phone || "";
        return User.findOne({ where: { email, isRegistrationCompleted: true } })
            .then((exists: User) => {
                if (exists) {
                    return res.send({
                        success: false,
                        message: "Registration failed. User with this email already registered."
                    });
                } else {
                    return User.findOne({ where: { email, isRegistrationCompleted: false } })
                        .then((user: User) => {
                            if (user) {
                                const user = {
                                    email,
                                    name,
                                    phone,
                                    isRegistrationCompleted: true,
                                    password: bcrypt.hashSync(req.body.password, config.saltRounds)
                                };
                                return exists.update(user)
                                    .then(() => res.send({ success: true, message: "User registered successfully" }))
                                    .catch((err: any) => res.send({ success: false, message: err }));
                            } else {
                                const nuser = {
                                    email,
                                    name,
                                    phone,
                                    isRegistrationCompleted: true,
                                    password: bcrypt.hashSync(req.body.password, config.saltRounds)
                                };
                                return User.create(nuser)
                                    .then(() => res.send({ success: true, message: "User registered successfully" }))
                                    .catch((err: any) => res.send({ success: false, message: err }));
                            }
                        })
                        .catch((error: any) => res.send({ success: false, message: error }));
                }
            })
            .catch((error: any) => res.send({ success: false, message: error.errors[0].message }));
    } else {
        res.send({ success: false, message: "All fields are mandatory" });
    }
}
export function addContact(req: any, res: any) {
    const email = req.body.email;
    const name = req.body.name || "";
    const phone = req.body.phone || "";
    return User.findOne({ where: { email } })
        .then((nuser: User) => {
            if (nuser) {
                return UserContact.create({ fkUserId: req.user.id, fkContactId: nuser.id })
                    .then(() => {
                        res.send({ success: true, message: "Contact added successfully" });
                    })
                    .catch((error: any) => { res.send({ success: false, message: error }); });
            } else {
                // tslint:disable-next-line:max-line-length
                const randompass = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                const ncuser = {
                    email,
                    name,
                    phone,
                    isRegistrationCompleted: false,
                    password: bcrypt.hashSync(randompass, config.saltRounds)
                };
                return User.create(ncuser)
                    .then((guser: User) => UserContact.create({ fkUserId: req.user.id, fkContactId: guser.id }))
                    .then(() => res.send({ success: true, message: "Contact added successfully" }))
                    .catch((err: any) => res.send({ success: false, message: err }));
            }
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
export function getContacts(req: any, res: any) {
    return User.findByPk(req.user.id, {
        include: [{
            model: User,
            as: "contacts",
            attributes: ["id", "name", "email", "phone"]
        }]
    })
        .then((user: User) => {
            res.send(user.contacts);
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
export function updateProfile(req: any, res: any) {
    const name = req.body.name || "";
    const phone = req.body.phone || "";
    return User.findByPk(req.user.id)
        .then((user: User) => {
            const updateuser = {
                name,
                phone,
                password: user.password
            };
            if (req.body.password) {
                updateuser.password = bcrypt.hashSync(req.body.password, config.saltRounds);
            }
            return user.update(updateuser)
                .then(() => res.send({ success: true, message: "Profile updated successfully" }))
                .catch((err: any) => res.send({ success: false, message: err }));
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
export function getExpences(req: any, res: any) {
    return User.findByPk(req.user.id, {
        include: [{
            model: UserExpence,
            as: "expences",
            attributes: ["id", "amount", "fkExpenceId", "fkPaidBy", "isSetteledUp"]
        }]
    })
        .then((user: User) => {
            res.send(user.expences);
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
export function settleExpences(req: any, res: any) {
    if (req.params.id) {
        return UserExpence.findByPk(req.params.id)
            .then((userexpence: UserExpence) => {
                if (userexpence) {
                    if (!userexpence.isSetteledUp) {
                        if (userexpence.fkPaidBy !== req.user.id) {
                            userexpence.update({ isSetteledUp: true })
                                .then(() => {
                                    return Expence.findByPk(userexpence.fkExpenceId, {
                                        include: [{
                                            model: UserExpence,
                                            as: "expence",
                                            attributes: ["id", "amount", "fkExpenceId", "fkPaidBy", "isSetteledUp"]
                                        }]
                                    });
                                }).then((expences: Expence) => {
                                    let allPaid = true;
                                    expences.expence.forEach((expence) => {
                                        if (!expence.isSetteledUp) {
                                            allPaid = false;
                                        }
                                    });
                                    if (allPaid) {
                                        expences.update({ isSetteledUp: true });
                                    }
                                    res.send({ success: true, message: "Expence setteled successfully" });
                                })
                                .catch((error: any) => { res.send({ success: false, message: error }); });
                        } else {
                            res.send({ success: false, message: "This expence is not paid by you" });
                        }
                    } else {
                        res.send({ success: false, message: "Expence is already setteled" });
                    }
                } else {
                    res.send({ success: false, message: "No expence found" });
                }
                // res.send(user.expences);
            })
            .catch((error: any) => { res.send({ success: false, message: error }); });
    }
}
