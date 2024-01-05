const Expense=require("../model/expense");
const User=require("../model/user");
const {Sequelize} = require("sequelize");

module.exports.leaderboard=async (req,res)=>{
    const user=await User.findAll({
            attributes:["name","totalExpense"],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
        group:["id"],
        order:[["totalExpense","DESC"]]
        }
    ).catch(err=>{
        console.log(err)
    })
    res.status(201).json(user);
}