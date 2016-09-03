var express = require('express');
var index=require("./index.js");
var article=require("./articles.js");
var talks=require("./talks.js");
var photos=require("./photos.js");
var users=require("./users.js");

var downcount=require("./downcount.js");
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

//manger users
router.post("/userlist", users.userlist);
router.post("/createUser", users.createUser);
router.post("/createUserType", users.createUserType);
router.post("/usertypelist", users.usertypeList);


router.post("/imgupload",multipartMiddleware,photos.imgupload);
router.get("/getphoto/:photoname",photos.getphoto);
//media
router.post("/photoslist",photos.photoslist);
//article

router.post("/createArticle", article.createArticle);
router.post("/ArticleList", article.articleList);
router.post("/ArticleDetail", article.ArticleDetail);
router.post("/MKcommit", article.MKcommit);
router.post("/DelArticle", article.delArticle);
router.post("/createArticleType", article.createArticleType);
router.post("/articletypelist", article.articleTypeList);

router.post("/createTalks", talks.createArticle);
router.post("/TalksList", talks.articleList);
router.post("/TalksDetail", talks.ArticleDetail);
router.post("/TalksMKcommit", talks.MKcommit);
router.post("/DelTalks", talks.delArticle);


//downcount
router.post("/downcount",downcount.downconts);
router.post("/downlist",downcount.downlist);
router.post("/createPlist",downcount.createPlist);

//collects
router.post("/mkcollect",collects.createCollects);
router.post("/mycollect",collects.find);

//circle
router.post("/createcircles",circle.createcircles);
router.post("/circleList",circle.circleList);
router.post("/joincircle",circle.joincircle);

router.get("/*", index.notfond);

module.exports = router;