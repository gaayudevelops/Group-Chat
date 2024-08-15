const Group = require('../models/group');
const User = require('../models/user')
const UserGroup = require('../models/user-group');
const sequelize = require('../util/database');
const { Op } = require("sequelize");


exports.postCreateGroup = async (req,res,next) => {

    const t = await sequelize.transaction();

    try{
        const groupName = req.body.groupname;
        await Group.create({name:groupName});
        const group = await Group.findAll({ where: {name: groupName} });
        const grpId = group[0].id;
        const usrId = req.user.id;
        await UserGroup.create({isAdmin: true, groupId: grpId, userId: usrId},{transaction:t})
        await t.commit();
        res.status(201).json({message:"Group Created Succesfully", success:true});
    
    } catch(err){
        console.log(err)
        await t.rollback();
        res.status(500).json({error:err, success:false});
    }
}

exports.getGroups = async (req,res,next) => {

    try{
        const usrId = req.user.id;
        let groupIds = [];
        const groups = await UserGroup.findAll({where: {userId: usrId} });
        for (let i = 0; i < groups.length; i++) {
            groupIds.push(groups[i].groupId);
           
        };
        if(groupIds.length>0){
            const userGroups = await Group.findAll({ where: { id: { [Op.or]: groupIds } } })
            res.status(201).json({usersGroups: userGroups, message:"List of groups in which the user is a member is sent", success:true});
        }else{
            res.status(201).json({message:"You are not a member of any groups", success:true});
        }

    } catch(err){
        console.log(err)
        res.status(500).json({error:err, success:false});
    }
}

exports.postAddUsertoGroup = async (req,res,next) => {

    const t = await sequelize.transaction();

    try{
        const yourid = req.user.id;
        const newMemberEmail = req.body.userEmail;
        const yourgrpid = req.body.groupid;
        const newMemberAdminpower = req.body.makeadmin;
        var newMemberid;

        const user = await User.findAll({where : {email:newMemberEmail} });

        if(user){
            newMemberid = user[0].id;
        }else{
            throw new error("User does not exists");
        }

        const you = await UserGroup.findAll({where : {userId:yourid, groupId:yourgrpid} })  // Checking your existence in the UserGroup table
        
        if(you){

            if(you[0].isAdmin){    // If you are an admin of the particular group
                
                if (newMemberAdminpower == "on") {  // if the new member to be added has admin access
                    await UserGroup.create({ isAdmin: true, groupId: yourgrpid, userId: newMemberid},{transaction:t});
                } else {
                    await UserGroup.create({ isAdmin: false, groupId: yourgrpid, userId: newMemberid},{transaction:t});
                }
                await t.commit();
                res.status(201).json({message:"User added to group", success:true});

            }else{
                throw new error("Sorry! You are not an admin");
            }

        }else{
            throw new error("Sorry! You are not a member of the group");
        } 

    } catch(err){
        console.log(err)
        await t.rollback();
        res.status(500).json({error:err, success:false});
    }
}


exports.postRemoveUserFromGroup = async (req,res,next) => {

    const t = await sequelize.transaction();

    try{
        const yourid = req.user.id;
        const removeMemberEmail = req.body.removeUserEmail;
        const yourgrpid = req.body.groupid;
        var removeMemberid;

        const user = await User.findAll({where : {email:removeMemberEmail} });
        
        if(user){
            removeMemberid = user[0].id;
        }else{
            throw new error("User does not exists");
        }

        const you = await UserGroup.findAll({where : {userId:yourid, groupId:yourgrpid} })  // Checking your existence in the UserGroup table
        
        if(you){

            if(you[0].isAdmin){    // If you are an admin of the particular group
                await UserGroup.destroy({where : {userId:removeMemberid, groupId:yourgrpid} }, {transaction:t});
                await t.commit();
                res.status(201).json({message:"User removed from the group", success:true});
            }else{
                throw new error("Sorry! You are not an admin");
            }

        }else{
            throw new error("Sorry! You are not a member of the group");
        } 

    } catch(err){
        console.log(err)
        await t.rollback();
        res.status(500).json({error:err, success:false});
    }
}