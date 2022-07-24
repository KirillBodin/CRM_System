const User=require("../models/User")
const bcrypt=require("bcryptjs")
module.exports.login = function(req, res) {
  res.status(200).json({
    login: {
      email:req.body.email,
      password:req.body.password
    }
  })
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

    }


  }

  /*user.save().then(()=>console.log("User created"))*/
}