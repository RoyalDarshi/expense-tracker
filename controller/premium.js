const Expense=require("../model/expense");
const User=require("../model/user");

module.exports.leaderboard=async (req,res)=>{
    const mainData=[];
    await User.findAll().then(async (user)=>{
        await Expense.findAll({order:["userId"]}).then(async (expense)=>{
            let userdata=user.map(data=>data.dataValues)
            let expenseData=expense.map(data=>data.dataValues)
            for (const user of userdata) {
                let totalExpense=0;
                for (const expense of expenseData) {
                    if(user.id===expense.userId){
                        totalExpense+=expense.expense;
                    }
                }
                mainData.push({name: user.name, expense: totalExpense})
            }
        })

        res.status(201).json(mainData.sort((a,b)=>b.expense-a.expense));
    })
}