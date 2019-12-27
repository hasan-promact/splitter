import { Group } from "../database/models/group";
import { Expence } from "../database/models/expence";
import { User } from "../database/models/user";
import { UserExpence } from "../database/models/userexpence";
import { UserGroup } from "../database/models/usergroup";

export function list(req: any, res: any) {
    return User.findByPk(req.user.id, {
        include: [{
            model: Group,
            as: "groups",
            attributes: ["id", "name"]
        }]
    })
        .then((user: User) => {
            res.send(user.groups);
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
export function create(req: any, res: any) {
    if (req.body.name) {
        const name = req.body.name || "";
        const description = req.body.description || "";
        return Group.create({ name, description, fkCreatorUserId: req.user.id, isSetteled: false })
            .then((group: Group) => {
                return UserGroup.create({ fkUserId: req.user.id, fkGroupId: group.id })
                    .then(() => res.send({ success: true, message: "Group created successfully" }))
                    .catch((err: any) => res.send({ success: false, message: err }));
            })
            .catch((error: any) => { res.send({ success: false, message: error }); });

    } else {
        res.send({ success: false, message: "Name is required" });
    }

}
export function addUsers(req: any, res: any) {

    const newUsers = req.body.users;
    const addPromise = [];
    for (const newUser of newUsers) {
        addPromise.push(UserGroup.create({ fkUserId: newUser, fkGroupId: req.params.id }));
    }
    Promise.all(addPromise)
        .then(() => res.send({ success: true, message: "Users added in group successfully" }))
        .catch((err: any) => res.send({ success: false, message: err }));

}
export function details(req: any, res: any) {
    return Group.findByPk(req.params.id, {
        include: [{
            model: User,
            as: "users",
            attributes: ["id", "name", "email", "phone"]
        },
        {
            model: Expence,
            as: "expence",
            attributes: ["id", "amount"]
        }]
    })
        .then((group: Group) => {
            res.send(group);
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });

}
export function addExpence(req: any, res: any) {
    let isUserPartOfGroup = false;
    const addPromise: any = [];
    let isPayerPartofGroup = false;
    if (!isNaN(req.params.id)) {
        if ((req.body.amount) && (req.body.paidBy)) {
            return Group.findByPk(req.params.id, {
                include: [{
                    model: User,
                    as: "users",
                    attributes: ["id"]
                }]
            })
                .then((group: Group) => {
                    if (group) {

                        group.users.forEach((user: User) => {
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
                        const createExpence = {
                            amount: req.body.amount,
                            fkGroupId: group.id,
                            fkPaidBy: req.body.paidBy,
                            fkCreatedBy: req.user.id,
                            isSetteledUp: false,
                            description: req.body.description || ""
                        };
                        return Expence.create(createExpence)
                            .then((expence: Expence) => {
                                const splitAmt = Math.round(req.body.amount / group.users.length);
                                const userExp = {
                                    amount: splitAmt,
                                    fkExpenceId: expence.id,
                                    fkPaidBy: req.body.paidBy,
                                    isSetteledUp: false,
                                    fkUserId: 0
                                };
                                group.users.forEach((user: User) => {
                                    userExp.fkUserId = user.id;
                                    addPromise.push(UserExpence.create(userExp));
                                });
                                return Promise.all(addPromise);
                            })
                            .then(() => res.send({ success: true, message: "Group expences added successfully" })
                            )
                            .catch((error: any) => { res.send({ success: false, message: error.message, error }); });
                    } else {
                        throw new Error("No group found");
                    }
                })
                .catch((error: any) => { res.send({ success: false, message: error.message, error }); });
        } else {
            res.send({ success: false, message: "Amount and paid by user id is required and should be numeric only" });
        }
    } else {
        res.send({ success: false, message: "Group id shoud be numeric only" });
    }
}
export function getExpences(req: any, res: any) {
    return Group.findByPk(req.params.id, {
        include: [{
            model: Expence,
            as: "expence",
            attributes: ["id", "amount"]
        }]
    })
        .then((group: Group) => {
            res.send(group);
        })
        .catch((error: any) => { res.send({ success: false, message: error }); });
}
