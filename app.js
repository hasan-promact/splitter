const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const routes = require("./routes");
const db = require('./database/models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('client'));
app.use(routes);
db.sequelize.sync({
    //   force: true
}).then(() => {
    app.listen(config.port, () => console.log('App listening on port ' + config.port));
});
