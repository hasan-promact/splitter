import { Express, Request, Response } from "express";
import * as express from "express";
import * as controllers from "../../controllers";
const usersController = controllers.users;
const authController = controllers.auth;

export const register = ( app: express.Application, router ) => {
    
    router.post("/login", usersController.login);
    router.post("/register", usersController.register);
    router.post("/addContact", authController.checkAuth, usersController.addContact);
    router.post("/getContacts", authController.checkAuth, usersController.getContacts);
    router.post("/updateProfile", authController.checkAuth, usersController.updateProfile);
    router.post("/getExpences", authController.checkAuth, usersController.getExpences);
    router.post("/settleExpences/:id", authController.checkAuth, usersController.settleExpences);
    router.get("/", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Users API!"
    }));
    router.post("/", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Users API!"
    }));
    return router
};
