import * as controllers from "../../controllers";
const groupsController = controllers.groups;
const authController = controllers.auth;
import { Express, Request, Response } from "express";
import * as express from "express";

export const register = ( app: express.Application, router ) => {
    router.get("/", (req: Request, res: Response) => res.status(200).send({
        message: "Welcome to the Groups API!"
    }));
	
    router.post("/list", authController.checkAuth, groupsController.list);
    router.post("/create", authController.checkAuth, groupsController.create);
    router.post("/addUsers/:id", authController.checkAuth, groupsController.addUsers);
    router.post("/details/:id", authController.checkAuth, groupsController.details);
    router.post("/addExpence/:id", authController.checkAuth, groupsController.addExpence);
    router.post("/getExpences/:id", authController.checkAuth, groupsController.getExpences);
    return router
};
