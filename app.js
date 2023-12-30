const path=require("path");

const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");

const db=require("./util/database");
const adminRouter=require("./routes/admin");
const errorController=require("./controller/error");
const User=require("./model/user");
const Expense=require("./model/expense");

const app=express();

app.use(cors());

app.use(bodyParser.json());

//app.use(bodyParser.urlencoded({extend:true}))

app.use(express.static(path.join(__dirname,"public")));

app.use(adminRouter);

app.use(errorController.pageNotFound);

Expense.belongsTo(User,{constraints:true,onDelete:"CASCADE"});
User.hasMany(Expense);

db.sync().then(()=>{
    app.listen(3000);
})