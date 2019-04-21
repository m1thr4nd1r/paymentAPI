const express = require('express');
const axios = require('axios');
const util = require('util')
const db = require('../../db');

const router = express.Router()

const gateway1URL = 'https://gtw1.rafaelverger.com.br'
const gateway2URL = 'https://gtw2.rafaelverger.com.br'
const gatewayURL = 'https://573e6faf-f775-4f9d-8550-fc5d818cd009.mock.pstmn.io'
var api = ''

async function getClients(req, res)
{
	console.log(req.url + " called (" + req.method + ")");
	var Clients = db.Mongoose.model('clients', db.ClientSchema, 'clients');

	var client = null

	//Client.find({clientID: id}, function(err, objs)
	await Clients.findById(req.params.id, function(err, objs)
	{
		if (err != null)
		{
			console.log(err)
			res.send("Cliente não encontrado.")
		}

		client = objs
    });

	var getUserService1 = null
    console.log("Client: " + util.inspect(client));

	try
	{
		getUserService1 = await axios.request(
		{
			baseURL: gatewayURL,
			url: "/clients/" + client.service1ID,
			method: 'get',
		});

		getUserService2 = await axios.request(
		{
			baseURL: gatewayURL,
			url: "/clients/" + client.service2ID,
			method: 'get',
		});
	}
	catch (error)
	{
		console.log("Request: " + error);
		res.send("Falha em obter o cliente.")
	}

    var services = null;

    try
    {
        services = await axios.all([getUserService1, getUserService2]);
    }
    catch (error)
    {
    	console.log(error);
		return res.send("Erro ao obter o usuário, verifique o log da aplicação.")
    }

	console.log("\nService 1\n" + util.inspect(services[0].data));
	console.log("\nService 2\n" + util.inspect(services[1].data));
	res.send("Service 1: " + util.inspect(services[0].data) + "\nService 2: " + util.inspect(services[1].data) + "\n");
}

router.get('/clients/:id', (req, res) => getClients(req, res));

router.get('/clients2/:id', (req, res) => {
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

async function createClient(req, res, next)
{
	console.log(req.url + " called (" + req.method + ")")

	try
	{
		const createUserService1 = await axios.request(
		{
			baseURL: gatewayURL,
			url: req.path,
			method: 'post',
			data: req.body
		});

		const createUserService2 = await axios.request(
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

		responses = await axios.all([createUserService1, createUserService2])

		console.log("\nService 1\n" + util.inspect(responses[0].data))
		console.log("\nService 2\n" + util.inspect(responses[1].data))

		var Clients = db.Mongoose.model('clients', db.ClientSchema, 'clients');

		debugger;

		var clientData = { service1ID: responses[0].data._id,
						   service2ID: responses[1].data._id, }

		console.log(responses[0].data.email)
		var clients = null

		try
		{
			clients = await Clients.create(clientData);
		}
		catch(error)
		{
			console.log(error)
			res.send("Falha em salvar o cliente.\n");
		}

		console.log("Clients: " + clients)

		return res.send("Service 1: " + util.inspect(responses[0].data) + "\nService 2: " + util.inspect(responses[1].data) + "\n")
	}
	catch (error)
	{
		console.log(error);
		return res.send("Erro no cadastro no usuário, verifique o log da aplicação.")
	}
}

router.post('/clients', (req, res, next) => createClient(req, res, next));

router.post('/clients2', (req, res, next) => 
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