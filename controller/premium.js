const Expense=require("../model/expense");
const User=require("../model/user");
const {Sequelize} = require("sequelize");

module.exports.leaderboard=async (req,res)=>{
    const user=await User.findAll({
            attributes:["name",[Sequelize.fn('sum',Sequelize.col('expenses.expense')),"total_expense"]],
            include:[
                {
                    model:Expense,
                    attributes:[]
                }
            ],
        group:["id"],
        order:[["total_expense","DESC"]]
        }
    )
    res.status(201).json(user);
}