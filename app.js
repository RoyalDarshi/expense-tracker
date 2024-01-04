const path=require("path");

const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
require("dotenv").config()

const db=require("./util/database");
const adminRouter=require("./routes/admin");
const premiumRouter=require("./routes/purchase");
const errorController=require("./controller/error");
const User=require("./model/user");
const Expense=require("./model/expense");
const Order=require("./model/order");

const app=express();

app.use(cors());

app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({extend:true}))

app.use(express.static(path.join(__dirname,"public")));

app.use(adminRouter);

app.use("/purchase",premiumRouter);

app.use(errorController.pageNotFound);

Expense.belongsTo(User,{constraints:true,onDelete:"CASCADE"});
User.hasMany(Expense);

Order.belongsTo(User,{constraints:true,onDelete:"CASCADE"});
User.hasMany(Order);

db.sync().then(()=>{
    app.listen(3000);
})