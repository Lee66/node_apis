var express = require('express');
var index=require("./index.js");
var applications=require("./applications.js");
var versions=require("./versions.js");
var article=require("./article.js");
var whitelist=require("./whitelist.js");
var users=require("./users.js");

var router=express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
//getplist
// router.get("/getplist/:v/:app",plist.getplist);
//users
router.post("/login", users.login);
router.post("/register", users.register);
router.post("/finduser", users.finduser);
router.post("/personfile", users.personfile);
router.post("/userlist", users.userlist);
router.get("/getuserpic/:username",users.getuserpic);
//manger users
router.post("/createUser", users.createUser);
router.post("/createUserType", users.createUserType);
router.post("/usertypelist", users.usertypeList);

//applications
router.post("/applicationlist",applications.applist);
router.post("/createApp",applications.createApp);
router.post("/imgupload",multipartMiddleware,applications.imgupload);
router.get("/getphoto/:photoname",applications.getphoto);
router.get("/moduleListHome",applications.getpreapplistHome);
// router.get("/moduleListHome/:phone",applications.getpreapplistHome);
router.get("/moduleList",applications.getpreapplist);
// router.get("/moduleList/:phone",applications.getpreapplist);
router.get("/moduleDetail/:modelname",applications.getpreappDetail);
router.post("/changeAppStatus",applications.changeAppStatus);


//media
router.post("/photoslist",applications.photoslist);

//versions
router.post("/versionlist",versions.versionlist);
router.post("/createVersion",versions.createVersion);
router.post("/fileupload",multipartMiddleware,versions.fileupload);
router.post("/changeVersionStatus",versions.changeVersionStatus);


//article

router.post("/createArticle", article.createArticle);
router.post("/ArticleList", article.articleList);
router.post("/MKcommit", article.MKcommit);
router.post("/DelArticle", article.delArticle);
router.post("/createArticleType", article.createArticleType);
router.post("/articletypelist", article.articleTypeList);

router.get("/getarticlelist",article.getarticlelist);
router.get("/getarticle/:name",article.getArticle);
router.get("/getallArticle/:typecode/:pageNum/:numPerPage",article.getallArticle);


router.post("/removeVersion",versions.removeVersion);

//whitelist
router.post("/createWhite", whitelist.createWhite);
router.post("/whitelist", whitelist.whiteList);

router.get("/*", index.notfond);
module.exports = router;
//
