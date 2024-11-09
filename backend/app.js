
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

//all http requests should respond in JSON objects and should follow a proper camel case convention.
// all http requests will get data in form of JSON objects.

// Use routes for http requests.

//all the routes should be named after entity.
// eg. get.("/order", function())
// eg. post.("/order", function())
// eg. put.("/order", function())
// eg. delete.("/order", function())

// add comments for all the http requests giving a brief description about the task it performs.

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    console.log('click here to open: http://localhost:3000/')
  })
