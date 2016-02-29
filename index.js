'use strict';

let koa         = require('koa');
let cors        = require("koa-cors");
let config      = require('./config');
let bodyParser  = require('koa-bodyparser');
let services    = require('./services');
let co          = require('co');

// koa app
let app = koa();
app.use(cors());
app.use(bodyParser());

co.wrap(function* () {
  try {
    //inject postgres client as middleware
    yield services.init();
    app.use(function *(next) {
      let ctx = this;
      yield next;
    });

    let userRoutes = require('./routes/user');
    app.use(userRoutes);
    let port = config.port || process.env.port || 8282;
    app.listen(port)
    console.log("App is listenning on port: " + port);
  } catch (e) {
    console.log(e)
  }
})();
