const express = require('express');
const axios = require('axios');
const util = require('util')
const db = require('../../db');

const router = express.Router()

const gateway1URL = 'https://gtw1.rafaelverger.com.br'
const gateway2URL = 'https://gtw2.rafaelverger.com.br'
const gatewayURL = 'https://573e6faf-f775-4f9d-8550-fc5d818cd009.mock.pstmn.io'
var api = ''

router.get('/clients/:id', (req, res) => {
	console.log(req.url + " called (" + req.method + ")");
	var Client = db.Mongoose.model('clients', db.ClientSchema, 'clients');

	//var id = parseInt(req.params.id, 10);
	var client = null

	//Client.find({clientID: id}, function(err, objs)
	Client.findById(req.params.id, function(err, objs)
	{
		if (err != null)
		{
			console.log(err)
			res.send("Cliente não encontrado.")
		}

		console.log("Objs: " + util.inspect(objs))
		client = objs
    });

    console.log("Client: " + util.inspect(client))

	const getUserService1 = axios.request(
	{
		baseURL: gatewayURL,
		url: req.path,
		method: 'get',
		data: (client != null) ? client.service1ID : null,
	});

	axios.all([getUserService1, getUserService1])
		.then(axios.spread(function (service1, service2) 
		{
			console.log("\nService 1\n" + util.inspect(service1.data))
    		console.log("\nService 2\n" + util.inspect(service2.data))

			return res.send("Service 1: " + util.inspect(service1.data) + "\nService 2: " + util.inspect(service2.data))
  		}))
  		.catch(err =>
		{
			console.log(err)
			return res.send("Erro ao obter o usuário, verifique o log da aplicação.")
		});
});

router.post('/clients', (req, res, next) => 
{
	console.log(req.url + " called (" + req.method + ")")
	
	const createUserService1 = axios.request(
	{
		baseURL: gatewayURL,
		url: req.path,
		method: 'post',
		data: req.body
	});

	const createUserService2 = axios.request(
	{
		baseURL: gatewayURL,
		url: req.path + 2,
		method: 'post',
		data: 
		{ 
			email: req.body.email,
			fullname: req.body.first_name + req.body.last_name
		}
	});

	axios.all([createUserService1, createUserService2])
		.then(axios.spread(function (service1, service2) {
    		console.log("\nService 1\n" + util.inspect(service1.data))
    		console.log("\nService 2\n" + util.inspect(service2.data))

			return res.send("Service 1: " + util.inspect(service1.data) + "\nService 2: " + util.inspect(service2.data))
  		}))
  		.catch(err =>
		{
			console.log(err)
			return res.send("Erro no cadastro no usuário, verifique o log da aplicação.")
		});
});

module.exports = router