import * as jwt from "jsonwebtoken";
import * as config from "../config";

export function checkAuth (req: any, res: any, next: any){
    const token = req.headers.token;
    if (!token) {
        return res.status(403).send({ auth: false, message: "No token provided." });
    }

    jwt.verify(token, config.jwtSecret, (err: any, decoded: any) => {
        if (err) {
            return res.status(500).send({ auth: false, message: "Failed to authenticate token." });
        }
        req.user = {
            login: decoded.login,
            id: decoded.id
        };
        next();
    });
};
