
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const router = express.Router();
var bodyParser = require('body-parser');


app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors());

router.get('/', function (req, res, next) {
    console.log("Home");
    res.end();
})

//demo for routing
const demo = require("./routes/demo.js");
app.use('/demo',demo);

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    console.log('click here to open: http://localhost:3000/')
  })