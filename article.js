var express = require('express');
var bodyParser     =         require("body-parser");  
var app = express();
var article=require("./routes/articles.js");
var routes=require("./routes/test.js");
app.listen(2015);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    // Website you wish to allow to connect
    // response.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    // // Request methods you wish to allow
    // response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // // Request headers you wish to allow
    // response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    // response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
//article
app.post("/cretirtle", article.cretirtle);
app.post("/ArticleList", article.articleList);
app.post("/DelArticle", article.delArticle);
app.post("/finActicle", article.find);
app.post("/updCirtle", article.updCirtle);

app.get("/connect",routes.connect);
app.get("/insert", routes.insert);
app.get("/find", routes.find);
app.get("/update", routes.update);
app.get("/remove", routes.remove);
app.post("/shows", routes.reqpost);
app.post("/productlist", routes.productlist);
//article
app.post("/cretirtle", article.cretirtle);