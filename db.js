const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/paymentAPI', {useNewUrlParser: true});

var clientSchema = new mongoose.Schema(
{
	clientID: Number,
    service1ID: Number,
    service2ID: Number,
}, { collection: 'clients' });

module.exports = { Mongoose: mongoose, ClientSchema: clientSchema }