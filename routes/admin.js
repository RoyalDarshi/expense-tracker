const express=require("express");

const adminController=require("../controller/admin");

const router=express.Router();

router.get("/",adminController.sendFile);

router.post("/user-signup",adminController.createUser);

router.post("/user-login",adminController.loginUser);

module.exports=router;