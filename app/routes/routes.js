const httpProxy = require('express-http-proxy')

const gateway1Proxy = httpProxy('https://gtw1.rafaelverger.com.br');
const gateway2Proxy = httpProxy('https://gtw2.rafaelverger.com.br');

module.exports = function(app, db) 
{
	app.post('/clients', (req,res) => 
	{
		console.log(req.body)
		//gateway1Proxy(req, res);
		res.send("Hello")
	});
};