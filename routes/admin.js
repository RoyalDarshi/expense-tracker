const express=require("express");

const adminController=require("../controller/admin");

const router=express.Router();

router.get("/",adminController.sendFile);

router.post("/user-signup",adminController.createUser);

router.post("/user-login",adminController.loginUser);

router.get("/find-user",adminController.isPremiumUser);

router.post("/create-expense",adminController.createExpense);

router.get("/get-expenses/:userId",adminController.getAllExpenses);

router.post("/delete-expense/:id",adminController.deleteExpense)

module.exports=router;