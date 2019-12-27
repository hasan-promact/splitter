import { Express, Request, Response } from "express";
import * as express from "express";
import * as groupRoute from "./api/groups";
import * as userRoute from "./api/users";
// API Routes

export const register = ( app: express.Application ) => {
	app.use("/api/users", userRoute.register(app,express.Router() ));
	app.use("/api/groups", groupRoute.register(app, express.Router()));
	app.use((req: Request, res: Response) => {
		res.status(200).send({ message: "Welcome to the beginning of nothingness." });
	});
};
