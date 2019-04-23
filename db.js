const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/paymentAPI', {useNewUrlParser: true});
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

var clientSchema = new mongoose.Schema(
{
	// clientID: Number,
    service1ID: String,
    service2ID: String,
}, { collection: 'clients' });

module.exports = { Mongoose: mongoose, ClientSchema: clientSchema }