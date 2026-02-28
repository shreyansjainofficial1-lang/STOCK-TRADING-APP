const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash passwod
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password,salt);

    const user = await User.create({
      name,
      email,
      password: hashPassword
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//-----Login User -----//

const loginUser = async (req,res)=>
{
    try{ 
        const{email,password} = req.body;
    const user = await User.findOne({email});
  
    if(!user){
        return res.status(400).json({message: "invalid email or password"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(400).json({ message: "invalid email or password"})
    }

    const token = jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
     res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
}
catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// --- Admin ---//

const admin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};


module.exports = { registerUser,loginUser };