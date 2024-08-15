const Message = require('../models/message');
const sequelize = require('../util/database');
// const S3services = require('../Services/s3Services');
const { Op } = require("sequelize");


exports.postMessage = async (req,res,next) => {

    const t = await sequelize.transaction();

    try{
        const name = req.user.name;
        const userid = req.user.id;
        const message = req.body.message;
        const groupid = req.body.groupid;
        const toId = req.body.toid;
        
        if(!groupid){
            await Message.create({name:name, message:message, to:toId, userId:userid},{transaction:t}); 
            await t.commit();
            res.status(201).json({message:"Your personnal message is sent", success:true});
        }else{
            await Message.create({name:name, message:message, groupId:groupid, userId:userid},{transaction:t});
            await t.commit();
            res.status(201).json({message:"Your group message is sent", success:true});
        }
        
    } catch(err){
        console.log(err);
        await t.rollback();
        res.status(500).json({error:err, success:false});
    }
}

exports.getMessages = async (req,res,next) => {

    try {
        const lastMessageId =  req.query.id;
        const messages = await Message.findAll({where:{ id: {[Op.gt]:lastMessageId} }});
        // const messages = await Chat.findAll({where:{msgid:{[Op.gt]:id},GroupId:null}});
        res.status(200).json({allMessages: messages});
    } catch (err) {
        console.log('GET Message is failing', JSON.stringify(err));
        res.status(500).json({ error: err })
    }
}

exports.getPersonalMessages = async (req,res,next) => {

    try {
        const fromId = req.user.id;
        const toId =  req.query.prsnid;
        const messages = await Message.findAll({where:{ [Op.or]: [ {[Op.and]: [{ userId: fromId }, { to: toId }]}, 
                                                                   {[Op.and]: [{ userId: toId }, { to: fromId }]} ] , 
                                                        groupId:null }});                                               
        // const messages = await Chat.findAll({where:{msgid:{[Op.gt]:id},GroupId:null}});
        res.status(200).json({allPersonalMessages: messages});
    } catch (err) {
        console.log('GET Message is failing', JSON.stringify(err));
        res.status(500).json({ error: err })
    }
}


exports.getGroupMessages = async (req,res,next) => {

    try {
        const groupid =  req.query.grpid;
        const messages = await Message.findAll({where:{ groupId: groupid }});
        // const messages = await Chat.findAll({where:{msgid:{[Op.gt]:id},GroupId:null}});
        res.status(200).json({allGroupMessages: messages});
    } catch (err) {
        console.log('GET Message is failing', JSON.stringify(err));
        res.status(500).json({ error: err })
    }
}



