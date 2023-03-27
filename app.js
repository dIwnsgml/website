const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");
const path = require("path");
const logger = require("morgan");
const http = require('http');
var server = http.createServer(app);


const mainRouter = require("./Router/main")

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '/public')));


app.use('/', mainRouter);



// error handler
app.use(function (err, req, res, next) {
  console.log(err.message, err.status)
  req.setMaxListeners(10000000); // Set the maximum allowed listeners.
  next();
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Server running ${port}`);
});

module.exports = app;