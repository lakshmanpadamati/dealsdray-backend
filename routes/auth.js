const express=require('express')
const authControllers=require('./../controllers/authControllers')
const router=express.Router();

router.get("/verify-token",authControllers.verifyToken)
router.post("/login",authControllers.login)

module.exports=router