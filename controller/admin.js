const path=require("path");

const rootDir=require("../util/path");
const User=require("../model/user");

module.exports.sendFile=(req,res,next)=>{
    res.sendFile(path.join(rootDir,"view","index.html"))
}

module.exports.createUser=async (req, res, next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
    await User.create({name:name,email:email,password:password}).then(data=>{
        res.status(201).json(data.dataValues);
    }).catch(err=>{
        res.status(201).json({message:err.errors[0].message});
    })
}

module.exports.loginUser=async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;
    console.log(req.body)
    await User.findAll({where:{email:email}}).then(data=>{
        if(!data[0]){
            return res.status(404).json("User not found");
        }
        if(data[0].dataValues.password===password){
            return res.status(201).json("User login successfully");
        }
        return res.status(401).json("User not authorized");
    }).catch(err=>{
        console.log(err)
    })
}
