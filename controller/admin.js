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

module.exports.sendFile=(req,res)=>{
    res.sendFile(path.join(rootDir,"view","index.html"))
}

module.exports.createUser=(req, res)=>{
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

module.exports.isPremiumUser=async (req,res)=>{
    const userId=decodeToken(req.headers.authorization);
    await User.findAll({where:{id:userId}}).then(data=>{
        res.status(201).json({isPremiumUser:data[0].dataValues.isPremiumUser})
    }).catch(err=>{
        console.log(err)
    })
}

module.exports.createExpense=(req,res)=>{
    const money=req.body.money;
    const category=req.body.category;
    const desc=req.body.description;
    const userId=decodeToken(req.body.userId);
    User.findOne({where:{id:userId}}).then(data=>{
        const prevExpense=data.totalExpense||0;
        User.update({totalExpense:prevExpense+ +money},{where:{id:userId}}).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })

    Expense.create({expense:money,category:category,description:desc,userId:userId}).then(data=>{
        res.status(201).json(data.dataValues);
    }).catch(err=>{
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

module.exports.deleteExpense=(req,res)=>{
    const id=req.params.id;
    Expense.destroy({where:{id:id}}).then(data=>{
        res.status(201).json(data);
    }).catch(err=>{
        console.log(err)
    })
}