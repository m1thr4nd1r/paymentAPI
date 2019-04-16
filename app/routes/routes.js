const express = require('express');
const httpProxy = require('express-http-proxy')
const gateway1Service = require('./gateway1')

const router = express.Router()

/*const gateway1Proxy = httpProxy('https://gtw1.rafaelverger.com.br');
const gateway2Proxy = httpProxy('https://gtw2.rafaelverger.com.br');
const gatewayProxy  = httpProxy('https://573e6faf-f775-4f9d-8550-fc5d818cd009.mock.pstmn.io')*/

router.use((req, res, next) => {
    console.log("Called: ", req.path)
    next()
})

/*router.post('/clients', (req,res) => 
{
	console.log(req.body)
	console.log(req.path)
	console.log(gatewayProxy(req, res));
	res.send("Hello")
});*/

router.use(gateway1Service)

module.exports = router