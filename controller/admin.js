const bcrypt=require("bcrypt");

const path=require("path");

const rootDir=require("../util/path");
const User=require("../model/user");

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
    console.log(req.body)
    await User.findAll({where:{email:email}}).then(data=>{
        if(!data[0]){
            return res.status(404).json("User not found");
        }
        bcrypt.compare(password,data[0].dataValues.password,(err,value)=>{
            if(value){
                return res.status(201).json("User login successfully");
            }
            return res.status(401).json("User not authorized");
        })

    }).catch(err=>{
        console.log(err)
    })
}
