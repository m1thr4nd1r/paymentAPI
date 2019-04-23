const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/paymentAPI', {useNewUrlParser: true});
mongoose.connect('mongodb://heroku_r8183dvj:j2nj9ugf6q0jv5nh01cmliu7sr@ds145786.mlab.com:45786/heroku_r8183dvj', {useNewUrlParser: true});

var clientSchema = new mongoose.Schema(
{
	// clientID: Number,
    service1ID: String,
    service2ID: String,
}, { collection: 'clients' });

module.exports = { Mongoose: mongoose, ClientSchema: clientSchema }