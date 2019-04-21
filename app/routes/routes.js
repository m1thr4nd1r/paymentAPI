const express = require('express');
const gatewayServices = require('./gateways')

const router = express.Router()

// router.use((req, res, next) => {
//     console.log("Called: ", req.path)
//     next()
//     console.log("Route: " + s)
// })

router.get('/clients/:id', (req, res, next) =>
{
	console.log(req.url + " called")
	next()
});

router.post('/clients', (req, res, next) => 
{
	console.log(req.url + " called")
	next()
});

router.use(gatewayServices)

module.exports = router