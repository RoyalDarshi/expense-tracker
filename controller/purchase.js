const Razorpay=require("razorpay");
const jwt=require("jsonwebtoken");

const User=require("../model/user");
const Order=require("../model/order");

module.exports.purchasePremium=(req,res)=>{
    const razorpay=new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    const amount=15000;
    const userId=jwt.decode(req.headers.authorization)
    razorpay.orders.create({amount,currency:"INR"},(err, data)=>{
        if(err){
            throw new Error(JSON.stringify(err));
        }
        Order.create({orderId:data.id,status:"PENDING",userId:userId}).then(()=>{
            return res.status(201).json({id:data.id,key_id:process.env.RAZORPAY_KEY_ID});
        })
    })
}

module.exports.updatePaymentStatus=async (req,res)=>{
    const orderId=req.body.orderId;
    const paymentId=req.body.paymentId;
    const userId=jwt.decode(req.headers.authorization);
    await Order.update({status:"SUCCESS",paymentId: paymentId},{where:{orderId:orderId}});
    await User.update({isPremiumUser:true},{where:{id:userId}});
    res.status(201).json({msg:"Payment Success"})
};

module.exports.paymentFailed=async (req,res)=>{
    const orderId=req.body.orderId;
    const status=req.body.status;
    await Order.update({status:status},{where:{orderId:orderId}});
    res.status(201).json({msg:"Payment Failed"})
}