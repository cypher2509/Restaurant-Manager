const express = require("express");
const router = express.Router();

router.get('/',async(req,res)=>{
   res.send("demo working");
});

router.get('/helloworld',(req,res)=>{
    res.send('Hello world!');
})

module.exports= router;