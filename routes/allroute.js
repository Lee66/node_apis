var express = require('express');
var article=require("./articles.js");
var routes=require("./test.js");
var users=require("./users.js");
var product=require("./product.js");
var apidoc=require("./apidoc.js");
var webup=require("./webup.js");
var downcount=require("./downcount.js");
//var appversion=require("./appversion.js");
//var customers=require("./customers.js");
// var goplist=require("./goplist.js");
var plist=require("./plist.js");
var getappkey=require("./getappkey.js");
var collects=require("./collects.js");
var circle=require("./circle.js");
var router=express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//users
router.post("/login", users.login);
router.post("/register", users.register);
router.post("/finduser", users.finduser);
router.post("/personfile", users.personfile);
router.get("/getuserpic/:username",users.getuserpic);
//test
router.get("/connect",routes.connect);
router.get("/insert", routes.insert);
router.get("/find", routes.find);
router.get("/update", routes.update);
router.get("/remove", routes.remove);
router.post("/shows", routes.reqpost);
router.post("/productlist", routes.productlist);
//article
//about article
router.post("/cretirtle", article.cretirtle);
router.post("/ArticleList", article.articleList);
router.post("/MKcommit", article.MKcommit);
router.post("/DelArticle", article.delArticle);
router.post("/finActicle", article.find);
router.post("/updCirtle", article.updCirtle);
// router.post("/cretirtle", article.cretirtle);  the same is not error
//products
router.post("/upload", multipartMiddleware,product.upload);
router.post("/products", product.products);
router.post("/productDetail", product.productDetail);
router.post("/createproduct", product.createproduct);
router.get("/getphoto/:photoname",product.getphoto);
router.post("/DelProduct", product.delProduct);
router.post("/dopiccommit", product.MKcommit);
//apidoc
router.post("/editapi", apidoc.editapi);
router.post("/createapi", apidoc.createapi);
router.post("/ApiList", apidoc.ApiList);
router.post("/changeapi", apidoc.changeapiname);
router.post("/removeApis", apidoc.removeApis);

//webupdate
router.post("/upcode", webup.createrecode);
router.post("/uplist", webup.uplist);
router.post("/webupload", multipartMiddleware,webup.upload);
router.post("/visioncheck", webup.visioncheck);
router.post("/lastversion", webup.lastversion);

//apps
router.post("/createapp",webup.createapp);
router.post("/applist",webup.applist);
router.post("/removeapp",webup.removeapp);
router.post("/modelList",webup.applicaitionList);

//downcount
router.post("/downcount",downcount.downconts);
router.post("/downlist",downcount.downlist);
router.post("/createPlist",downcount.createPlist);
// router.get("/goplist", goplist.goplist);
// router.get("/getplist/:v/:app", downcount.getplists);
// router.get("/getplist/:v/:app/:update", downcount.getplists);

//getplist
router.get("/getplist",plist.getplist);
router.get("/getplist/:v/:app",plist.getplist);
//gettag
router.get("/getvisiontag/:v",plist.gettag);
//mork post
router.get("/getappkey",getappkey.getAppkey);

//appversion
router.post("/appversionlist",plist.appversionlist);
router.post("/createAppversion",plist.createAppVersion);
router.post("/updateAppversion",plist.doupdate);

//customers
//router.get("/customers",customers.getAppkey);

//collects
router.post("/mkcollect",collects.createCollects);
router.post("/mycollect",collects.find);

//circle
router.post("/createcircles",circle.createcircles);
router.post("/circleList",circle.circleList);
router.post("/joincircle",circle.joincircle);

router.post("/*", apidoc.notfond);

module.exports = router;