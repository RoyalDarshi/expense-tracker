const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const path=require("path");

const rootDir=require("../util/path");
const User=require("../model/user");
const Expense=require("../model/expense");

function createToken(id){
    return jwt.sign(id,"72gsd33tags3fdh32hdh3hch44gd32hgh32g3hg")
}

function decodeToken(token){
    return jwt.decode(token);
}

module.exports.sendFile=(req,res,next)=>{
    res.sendFile(path.join(rootDir,"view","index.html"))
}

module.exports.createUser=(req, res, next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password,10,async (err,hash)=>{
        await User.create({name:name,email:email,password:hash}).then(data=>{
            res.status(201).json(data.dataValues);
        }).catch(err=>{
            res.status(201).json({message:"User already exist"});
        })
    })

}

module.exports.loginUser=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    await User.findAll({where:{email:email}}).then(data=>{
        if(!data[0]){
            return res.status(404).json("User not found");
        }
        bcrypt.compare(password,data[0].dataValues.password,(err,value)=>{
            if(value){
                return res.status(201).json({id:createToken(data[0].dataValues.id)});
            }
            else {
                return res.status(401).json("User not authorized");
            }
        })

    }).catch(err=>{
        console.log(err)
    })
}

module.exports.createExpense=(req,res,next)=>{
    const money=req.body.money;
    const category=req.body.category;
    const desc=req.body.description;
    const userId=req.body.userId;
    Expense.create({expense:money,category:category,description:desc,userId:decodeToken(userId)}).then(data=>{
        res.status(201).json(data.dataValues);
    })
}

module.exports.getAllExpenses=(req,res,next)=>{
    const userId=req.params.userId;
    Expense.findAll({where:{userId:decodeToken(userId)}}).then(data=>{
        res.status(201).json(data)
    })
}

module.exports.deleteExpense=(req,res,next)=>{
    const id=req.params.id;
    Expense.destroy({where:{id:id}}).then(data=>{
        res.status(201).json(data);
    })
}