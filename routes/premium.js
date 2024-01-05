const express=require("express");

const premiumController=require("../controller/premium");

const Router=express.Router();

Router.get("/leaderboard",premiumController.leaderboard);

module.exports=Router;