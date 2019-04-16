const express = require('express');
const httpProxy = require('express-http-proxy')
const router = express.Router()

const apiAdapter = require('../apiAdapter')
const BASE_URL = 'https://573e6faf-f775-4f9d-8550-fc5d818cd009.mock.pstmn.io'
const api = apiAdapter(BASE_URL)

// const gatewayProxy = httpProxy('https://gtw1.rafaelverger.com.br');
const gatewayProxy = httpProxy(
	'https://573e6faf-f775-4f9d-8550-fc5d818cd009.mock.pstmn.io', 
	{
		https: true,
		proxyReqOptDecorator: function(proxyReqOpts, originalReq) 
		{
		    proxyReqOpts.rejectUnauthorized = false
		    return proxyReqOpts;
		},
		// userResDecorator: function(proxyRes, proxyResData, userReq, userRes) 
		// {
		//     data = JSON.parse(proxyResData.toString('utf8'));
		//     data.newProperty = 'exciting data';
		//     return JSON.stringify(data);
		// }			
	});

router.get('/clients', (req, res) => {
  res.send(req.path + " called")
})

router.post('/clients', (req, res) => 
{
	console.log(req.body)
	console.log(req.path + " called")
	console.log(gatewayProxy(req,res))
	console.log(api.get(req.path).then(resp => {
		res.send(resp.data)
	}));
	res.send(gatewayProxy(req,res))
});

module.exports = router