//mongodb://<dbuser>:<dbpassword>@ds135335.mlab.com:35335/garment

var mongoose = require('mongoose');


var port = process.env.PORT || 3000;
var secret = process.env.SECRET || 'fiverr54sa35d4s5d4fs532d5s4d32s';


var database = process.env.SECRET || 'mongodb://root:abc123@ds135335.mlab.com:35335/garment';
module.exports = { database, port, secret };