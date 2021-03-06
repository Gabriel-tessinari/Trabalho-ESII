const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation,loginValidation} = require('../validacao');

router.post('/register', async(req, res)=>{
    const {error} = registerValidation(req.body);
    if(!{error} === undefined) return res.status(400).send(error.details[0].message);

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email já cadastrado.');

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword

    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id });
    }catch(err){
        res.status(400).send(err.message);
    }
});

router.post('/login', async(req,res) =>{
    const {error} = loginValidation(req.body);
    if(!{error} === undefined) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email ou senha incorreto.');

    const validPass = bcrypt.compareSync(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Email ou senha incorreto.');

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({
        'token': token,
        'id': user._id
    });
});

module.exports = router;