import * as bodyParser from "body-parser";
import * as express from "express";
import * as config from "./config";
import sequelize from "./database/models/index";
import * as routes from "./routes";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("client"));
// app.use(routes);
routes.register( app );
sequelize.sync({
    //   force: true
}).then(() => {
app.listen(config.port, () => console.log("App listening on port " + config.port));
 });
