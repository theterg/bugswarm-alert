module.exports = {
	port: 3000,
	//bugswarm participation creds
	swarm: {
		apikey: '',
		resource: '',
		swarms: ['']
	},
	//Twilio creds
	twilio: {
		sid: '',
		authToken: '',
		outgoing: '',
		hostname: require('os').hostname
	}
};