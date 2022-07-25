const User=require("../models/User")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const keys=require('../config/keys')
const errorHandler=require("../utils/errorHandler")


module.exports.login = async function(req, res) {
const candidate = await User.findOne({email: req.body.email})

  if(candidate){
    //check password>, user exist
    const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
    if (passwordResult){
      //generate token. passwords matches
      const token = jwt.sign({
        email:candidate.email,
        userId: candidate._id
      }, keys.jwt,{expiresIn: 60 * 60})

      res.status(200).json({
        token: `Bearer ${token}`
      })
    }else {
      res.status(401).json({
        massage:"Try again. Wrong password"
      })
    }
  }else {
    // No User, err
    res.status(404).json({
      massage:"Can't find user with that email"
    })
  }
}


module.exports.register = async function(req, res) {

  const  candidate = await User.findOne({email:req.body.email})

  if(candidate) {
    // if User exist, throw err
    res.status(409).json({
      massage: "User already exist. Try another email"
    })
  }
  else {
    //create user
    const salt= bcrypt.genSaltSync(10)
    const {email, password}=req.body
    const user = new User({
      email:email,
      password: bcrypt.hashSync(password,salt)
    })
    try{
      await user.save()
      res.status(201).json(user)
    }catch (e) {
      errorHandler(res,e)
    }


  }

  /*user.save().then(()=>console.log("User created"))*/
}