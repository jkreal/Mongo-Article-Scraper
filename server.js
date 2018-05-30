const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");


var app = express();
var PORT = process.env.PORT || 3301;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/assets", express.static("public/assets"));
require("./controllers/scraper-controller")(app);


app.listen(PORT, function() {
	console.log('app NOW listening on port: ' + PORT);
});