
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();

app.use(express.urlencoded({extended:true}));
router.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
})


const demo = require("./routes/demo.js");
app.use('/demo',demo);

app.get('/home',(req,res)=>{
    res.render('home');
})


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    console.log('click here to open: http://localhost:3000/')
  })