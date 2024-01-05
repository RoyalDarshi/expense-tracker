const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const path=require("path");

const rootDir=require("../util/path");
const User=require("../model/user");
const Expense=require("../model/expense");
const sequelize=require("../util/database");

function createToken(id){
    return jwt.sign(id,"72gsd33tags3fdh32hdh3hch44gd32hgh32g3hg")
}

function decodeToken(token){
    return jwt.decode(token);
}

module.exports.sendFile=(req,res)=>{
    res.sendFile(path.join(rootDir,"view","index.html"))
}

module.exports.createUser=async (req, res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    bcrypt.hash(password,10,async (err,hash)=>{
        await User.create({name:name,email:email,password:hash,isPremiumUser:false}).then(data=>{
            res.status(201).json(data.dataValues);
        }).catch(()=>{
            res.status(201).json({message:"User already exist"});
        })
    })

}

module.exports.loginUser=async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;
    await User.findOne({where:{email:email}}).then(data=>{
        if(!data){
            return res.status(404).json("User not found");
        }
        bcrypt.compare(password,data.dataValues.password,(err,value)=>{
            if(value){
                return res.status(201).json({id:createToken(data.dataValues.id)});
            }
            else {
                return res.status(401).json("Wrong Password");
            }
        })

    }).catch(err=>{
        console.log(err)
    })
}

module.exports.isPremiumUser=async (req,res)=>{
    const userId=decodeToken(req.headers.authorization);
    await User.findOne({where:{id:userId}}).then(data=>{
        res.status(201).json({isPremiumUser:data.dataValues.isPremiumUser})
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.createExpense=async (req,res)=>{
    const money=req.body.money;
    const category=req.body.category;
    const desc=req.body.description;
    const userId=decodeToken(req.body.userId);
    const trans=await sequelize.transaction();
    User.findOne({where:{id:userId}}).then(data=>{
        const prevExpense=data.totalExpense||0;
        User.update({totalExpense:prevExpense+ +money},{where:{id:userId}},{transaction:trans}).then(async ()=>{
            Expense.create({expense:money,category:category,description:desc,userId:userId},
                {transaction:trans}).then(async (data)=>{
                await trans.commit()
                res.status(201).json(data.dataValues);
            })
        })
    }).catch(async (err)=>{
        await trans.rollback();
        console.log(err)
    })
}

module.exports.getAllExpenses=(req,res)=>{
    const userId=req.params.userId;
    Expense.findAll({where:{userId:decodeToken(userId)}}).then(data=>{
        res.status(201).json(data)
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.deleteExpense=async (req,res)=>{
    const id=req.params.id;
    const userId=decodeToken(req.body.userId);
    const trans=await sequelize.transaction();
    const money=req.body.money;
    User.findOne({where:{id:userId}}).then((data)=>{
        User.update({totalExpense:data.dataValues.totalExpense-money}
            ,{where:{id:userId}},{transaction:trans}).then(async ()=>{
            Expense.destroy({where:{id:id}},{transaction:trans}).then(async (data)=>{
                await trans.commit()
                res.status(201).json(data);
            })
        })
    }).catch(async (err)=>{
        await trans.rollback()
        console.log(err)
    })
}