import { usersService } from "../services/index.js"
import { logger } from "../utils/logger.js";

const getAllUsers = async(req,res)=>{
    try{
        const users = await usersService.getAll();
        res.send({status:"success",payload:users})
    }catch(error){
        logger.error(error.message);
        res.status(500).send({status:"error", error:error.message});
    }
}

const getUser = async(req,res)=> {
    try{
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error",error:"User not found"})
        res.send({status:"success",payload:user})
    }catch(error){
        logger.error(error.message);
        res.status(500).send({status:"error", error:error.message});
    }
}

const updateUser =async(req,res)=>{
    try{
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error", error:"User not found"})
        const result = await usersService.update(userId,updateBody);
        res.send({status:"success",message:"User updated"})
    }catch(error){
        logger.error(error.message);
        res.status(500).send({status:"error", error:error.message});
    }
}

const deleteUser = async(req,res) =>{
    try{
        const userId = req.params.uid;
        const result = await usersService.getUserById(userId);
        res.send({status:"success",message:"User deleted"})
    }catch(error){
        logger.error(error.message);
        res.status(500).send({status:"error", error:error.message});
    }
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}