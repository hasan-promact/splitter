import bodyParser from "body-parser";
import express from "express";
import * as http from "http";
const app = express();
import { config } from "./config";
import { db } from "./database/models";
import { routes } from "./routes";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("client"));
app.use(routes);
db.sequelize.sync({
    //   force: true
}).then(() => {
    app.listen(config.port, () => /*console.log("App listening on port " + config.port)*/);
});
