const Group = require('../database/models').Group;
const User = require('../database/models').User;
const UserGroup = require('../database/models').UserGroup;
const Expence = require('../database/models').Expence;
const UserExpence = require('../database/models').UserExpence;

function list(req, res) {
    return User.findByPk(req.user.id, {
        include: [{
            model: Group,
            as: 'groups',
            attributes: ['id', 'name']
        }]
    })
        .then(user => {
            res.send(user.groups);
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}
function create(req, res) {
    if (req.body.name) {
        var name = req.body.name || "";
        var description = req.body.description || "";
        return Group.create({ name: name, description: description, fkCreatorUserId: req.user.id, isSetteled: false })
            .then(group => {
                return UserGroup.create({ fkUserId: req.user.id, fkGroupId: group.id })
                    .then(() => res.send({ success: true, message: "Group created successfully" }))
                    .catch((err) => res.send({ success: false, message: err }));
            })
            .catch((error) => { console.log(error); res.send({ success: false, message: error }); });

    } else {
        res.send({ success: false, message: "Name is required" });
    }

}
function addUsers(req, res) {

    var newUsers = req.body.users;
    var addPromise = []
    for (var i = 0; i < newUsers.length; i++) {
        console.log(newUsers[i]);
        addPromise.push(UserGroup.create({ fkUserId: newUsers[i], fkGroupId: req.params.id }))
    }
    Promise.all(addPromise)
        .then(() => res.send({ success: true, message: "Users added in group successfully" }))
        .catch((err) => res.send({ success: false, message: err }));

}
function details(req, res) {
    return Group.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'users',
            attributes: ['id', 'name', 'email', 'phone']
        },
        {
            model: Expence,
            as: 'expence',
            attributes: ['id', 'amount']
        }]
    })
        .then(group => {
            res.send(group);
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });

}
function addExpence(req, res) {
    var isUserPartOfGroup = false;
    var addPromise = [];
    var isPayerPartofGroup = false;
    if (!isNaN(req.params.id)) {
        if ((req.body.amount) && (req.body.paidBy)) {
            return Group.findByPk(req.params.id, {
                include: [{
                    model: User,
                    as: 'users',
                    attributes: ['id']
                }]
            })
                .then(group => {
                    if (group) {
                        console.log("members -> " + group.users.length);
                        group.users.forEach(user => {
                            if (req.user.id === user.id) {
                                isUserPartOfGroup = true;
                            }
                            if (user.id === req.body.paidBy) {
                                isPayerPartofGroup = true;
                            }
                        });

                        if (!isUserPartOfGroup) {
                            throw new Error("You are not part of this group");
                        }
                        if (!isPayerPartofGroup) {
                            throw new Error("Expence payer is not part of group");
                        }
                        var createExpence = {
                            amount: req.body.amount,
                            fkGroupId: group.id,
                            fkPaidBy: req.body.paidBy,
                            fkCreatedBy: req.user.id,
                            isSetteledUp: false,
                            description: req.body.description || ""
                        };
                        return Expence.create(createExpence)
                            .then(expence => {
                                var splitAmt = Math.round(req.body.amount / group.users.length);
                                var userExp = {
                                    amount: splitAmt,
                                    fkExpenceId: expence.id,
                                    fkPaidBy: req.body.paidBy,
                                    isSetteledUp: false
                                }
                                group.users.forEach(user => {
                                    userExp.fkUserId = user.id;
                                    addPromise.push(UserExpence.create(userExp));
                                });
                                return Promise.all(addPromise);
                            })
                            .then(() => res.send({ success: true, message: "Group expences added successfully" })
                            )
                            .catch((error) => { console.log(error.message); res.send({ success: false, message: error.message, error: error }); });
                    } else {
                        throw new Error("No group found");
                    }
                })
                .catch((error) => { console.log(error.message); res.send({ success: false, message: error.message, error: error }); });
        } else {
            res.send({ success: false, message: "Amount and paid by user id is required and should be numeric only" });
        }
    } else {
        res.send({ success: false, message: "Group id shoud be numeric only" });
    }
}
function getExpences(req, res) {
    return Group.findByPk(req.params.id, {
        include: [{
            model: Expence,
            as: 'expence',
            attributes: ['id', 'amount']
        }]
    })
        .then(group => {
            res.send(group);
        })
        .catch((error) => { console.log(error); res.send({ success: false, message: error }); });
}

module.exports = {
    create,
    list,
    details,
    addUsers,
    addExpence,
    getExpences
};