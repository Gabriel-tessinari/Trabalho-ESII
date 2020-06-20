const router = require('express').Router();
const Site = require('../model/Site');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { saveValidation, updateValidation } = require('../validacao');

router.post('/', async(req, res)=>{
    const {error} = saveValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        await User.find({_id: req.body.user});
    }catch(err){
        console.log(err)
        res.status(400).send('Usuário não registrado!');
    }

    const site = new Site({
        text: req.body.text,
        user: req.body.user
    });
    try{
        await site.save();
        res.send({ site: site._id });
    }catch(err){
        console.log(err)
        res.status(400).send(err);
    }
});

router.get('/:userId', async(req, res)=>{
    const userId = req.params.userId;
    try{
        await Site.find({user: userId}).then(function (sites) {
            res.send(sites);
        });
    }catch(err){
        console.log(err)
        res.status(400).send(err);
    }
});

router.delete('/:siteId', async(req, res)=>{
    const siteId = req.params.siteId;
    try{
        const deletedSite = await Site.findOneAndDelete({_id: siteId});
        res.send({ siteId: deletedSite._id, text: deletedSite.text, user: deletedSite.user });
    }catch(err){
        console.log(err)
        res.status(400).send('Site não existente no BD para ser deletada!');
    }
});

router.put('/', async(req, res)=>{
    const site = new Site({
        _id: req.body._id,
        text: req.body.text
    });
    try{
        const updatedSite = await Site.findOneAndUpdate({_id: site._id}, {text: site.text});
        res.send({ siteId: updatedSite._id, text: updatedSite.text, user: updatedSite.user });
    }catch(err){
        console.log(err)
        res.status(400).send('Site não existente no BD para ser alterada!');
    }
});

module.exports = router;