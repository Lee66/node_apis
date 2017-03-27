var express = require('express');
var index=require("./index.js");
var article=require("./articles.js");
var talks=require("./talks.js");
var photos=require("./photos.js");
var users=require("./users.js");
var mypicture=require("./myPicture.js");

var downcount=require("./downcount.js");
var collects=require("./collects.js");
var circle=require("./circle.js");
var applications=require("./applications.js");
var versions=require("./versions.js");
var whitelist=require("./whitelist.js");
var video=require("./video.js");
var sendMail=require("./sendMail.js");
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
router.get("/getphotoPal/:photopath/:photoname",photos.getphotoPal);


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

router.get("/getarticle/:name",article.getArticle);

//my picture

router.post("/createPicture", mypicture.createArticle);
router.post("/PictureList", mypicture.articleList);
router.post("/PictureDetail", mypicture.ArticleDetail);
router.post("/MKcommit", mypicture.MKcommit);
router.post("/DelPicture", mypicture.delArticle);
router.post("/createPictureType", mypicture.createArticleType);
router.post("/Picturetypelist", mypicture.articleTypeList);

router.get("/getPicture/:name",mypicture.getArticle);


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

//applications
router.post("/applicationlist",applications.newapplist);
router.post("/createApp",applications.createApp);

router.get("/moduleListHome",applications.getpreapplistHome);
// router.get("/moduleListHome/:phone",applications.getpreapplistHome);

// router.get("/moduleList",applications.getpreapplist);
router.get("/moduleList",applications.getapplist);

router.get("/versionList/:appUser",versions.getVersionList);


// router.get("/moduleList/:phone",applications.getpreapplist);
router.get("/moduleDetail/:modelname",applications.getpreappDetail);
router.post("/changeAppStatus",applications.changeAppStatus);

router.post("/removeApp",applications.removeApp);

//versions
router.post("/versionlist",versions.versionlist);
router.post("/createVersion",versions.createVersion);
router.post("/fileupload",multipartMiddleware,versions.fileupload);
router.post("/changeVersionStatus",versions.changeVersionStatus);
router.get("/getfilePal/:photoname",versions.getfilePal);



router.post("/removeVersion",versions.removeVersion);

router.post("/createVersionType", versions.createVersionType);
router.post("/Versiontypelist", versions.versionTypeList);

//whitelist
router.post("/createWhite", whitelist.createWhite);
router.post("/whitelist", whitelist.whiteList);

//videos
//versions
router.post("/videoList",video.videosList);
router.post("/createVideo",video.createVideo);
router.post("/removeVideo",video.removeVideo);
router.post("/videoUpload",multipartMiddleware,video.videoupload);

router.get("/create_qrcode",photos.createQrcode);

// send Email
router.post("/sendEmail",sendMail.sendEmail);
router.post("/sendSMTPEmail",sendMail.sendSMTPmail);
router.post("/createEmail",sendMail.createEmail);
router.post("/EmailList",sendMail.EmailList);
router.post("/removeMail",sendMail.removeMail);

router.get("/*", index.notfond);

module.exports = router;