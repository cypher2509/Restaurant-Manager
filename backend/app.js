
const express = require('express');
const app = express();
const port = 3000;

//all apis should respond in json.


app.listen(port, () => {
    console.log(`app listening on port ${port}`)
    console.log('click here to open: http://localhost:3000/')
  })
