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

	try
	{
		const ClientsDB = db.Mongoose.model('clients', db.ClientSchema, 'clients');

		var client = await ClientsDB.findById(req.params.id)
	    console.log("Client: " + util.inspect(client));

		const getUserService1 = await axios.request(
		{
			baseURL: gateway1URL,
			url: "/clients/" + client._doc.service1ID,
			method: 'get',
		});

		const getUserService2 = await axios.request(
		{
			baseURL: gateway2URL,
			url: "/clients/" + client._doc.service2ID,
			method: 'get',
		});

	    var services = await axios.all([getUserService1, getUserService2]);

	    debugger;

	    var mergeClient = { 
	    					_id: req.params.id,
	    					createdAt: services[0].data.createdAt,
	    					first_name: services[0].data.first_name,
	    					last_name: services[0].data.last_name,
	    					fullname: services[1].data.fullname,
	    					email: services[0].data.email,
	    				  };

		console.log("\nService 1\n" + util.inspect(services[0].data));
		console.log("\nService 2\n" + util.inspect(services[1].data));
		return res.send(mergeClient)
	}
	catch (error)
	{
		console.log(error);
		return res.send("Erro ao obter o usuário, verifique o log da aplicação.")
	}
}

async function createClient(req, res, next)
{
	console.log(req.url + " called (" + req.method + ")")

	try
	{
		const createUserService1 = await axios.request(
		{
			baseURL: gateway1URL,
			url: req.path,
			method: 'post',
			data: req.body
		});

		const createUserService2 = await axios.request(
		{
			baseURL: gateway2URL,
			url: req.path,
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

		const ClientsDB = db.Mongoose.model('clients', db.ClientSchema, 'clients');

		var clientData = { service1ID: responses[0].data._id,
						   service2ID: responses[1].data._id, }

		var clients = await ClientsDB.create(clientData);
		console.log("\nClients: " + clients + "\n")

		//return res.send("Service 1: " + util.inspect(responses[0].data) + "\nService 2: " + util.inspect(responses[1].data) + "\n")
		return res.send("Cliente criado com sucesso!")
	}
	catch (error)
	{
		console.log(error);
		return res.send("Erro no cadastro no usuário, verifique o log da aplicação.")
	}
}

router.get('/clients/:id', (req, res) => getClients(req, res));

router.post('/clients', (req, res, next) => createClient(req, res, next));

module.exports = router