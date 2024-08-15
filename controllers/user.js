const User= require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const { Op } = require("sequelize");
require('dotenv').config();

exports.postSignUp = async (req,res,next) => {

    const t = await sequelize.transaction();

    try{
        const name=req.body.name;
        const email=req.body.email;
        const phoneno = req.body.phoneno;
        const password=req.body.password;

        if(!name || !email || !phoneno || !password){
            return res.status(400).json({error: "Fields are not filled"});
        }
        const saltrounds=10;
        bcrypt.hash(password, saltrounds,async (err, hash) => {
        console.log(err);
        await User.create({name:name, email:email, phoneNo:phoneno, password:hash},{transaction:t});
        await t.commit();
        res.status(201).json({message:"Successfully Signed up", success:true});

        })    
    } catch(err){
        await t.rollback();
        res.status(500).json({error:err, success:false});
    
    }
}

function generatetokenid (id,name,phoneNo) {   //function to generate  secret token for the id and name so that the user 
    //can access and manage only his own expenses and not of other users

    return jwt.sign({ userId:id, name:name, userPhoneno:phoneNo}, process.env.TOKEN_SECRET) //assigning the token for the users with a secret key
}


exports.postLogin = async (req,res,next) => {

    try{
        const email=req.body.email;
        const password=req.body.password;

        if(!email||!password){
            return res.status(400).json({error: "Fields are not filled"});
        }

        const user = await User.findAll({where:{email:email}});

        if(user.length > 0){ //if the user array is not empty, email exists in db.
            bcrypt.compare(password, user[0].password, (err,result) => {
                if(err){ //error from bcrypt.compare
                    throw new Error('Something is wrong');
                }
                if(result === true){ //if bcrypt.compare is success with correct password  
                    res.status(200).json({success: true, message:"User logged in Successfully",
                     token: generatetokenid(user[0].id, user[0].name, user[0].phoneNo)});
                    //token is generated for the user's name and id with a secret key
                }
                else{ //if bcrypt.compare is success with incorrect password  
                    return res.status(401).json({success: false, message:"Password is incorrect"})
                }
            })
        }else{ //if user array is empty, email does not exists in db.
            return res.status(404).json({success: false, message:"User does not exist"})
        }       
    }catch(err){
        res.status(500).json({error:err});
    }

}

exports.getAllUsers = async (req,res,next) => {

    try{
        const usrId = req.user.id;
        const allUsers = await User.findAll({where: { id:{ [Op.ne]:usrId } } });
        if(allUsers.length>0){
            res.status(201).json({allOtherUsers:allUsers, message:"All other users of this chat app are sent", success:true});
        }else{
            res.status(201).json({message:"You are the only user in this chat app", success:true});
        }
    } catch(err){
        console.log(err)
        res.status(500).json({error:err, success:false});
    }
}

exports.getSingleUser = async (req,res,next) => {

    try{
        const usrId = req.query.id;
        const user = await User.findByPk(usrId)
        console.log(user)
        res.status(201).json({User:user, message:"Particular user details is sent", success:true});
    } catch(err){
        console.log(err)
        res.status(500).json({error:err, success:false});
    }
}

