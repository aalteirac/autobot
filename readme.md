# AutoBot

Goal: 
Having robot machine capable of auto-registering itself on the orchestrator

Concept:
A simple script (createMachine.ps1), deployed on the robot machine (in master image) calling a little web endpoint (server.js) on the orchestrator machine, API logic is then protected and only server-side

[![Alt text](https://img.youtube.com/vi/ihm1_JRF-3o/0.jpg)](https://www.youtube.com/watch?v=ihm1_JRF-3o)

## Getting Started

Install latest nodejs for running web server

Edit server.js to enter your orchestrator information

```
var orchestrator = new Orchestrator({
	 tenancyName: 'default',           // The Orchestrator Tenancy
	 usernameOrEmailAddress: 'admin',// The Orchestrator login
	 password: 'passwordhardtofind',               // The Orchestrator password
	 hostname: 'win-hj42t3fg0nu', // The instance hostname
	 isSecure: true,                // optional (defaults to true)
	 port: 443, // optional (defaults to 80 or 443 based on isSecure)
	 invalidCertificate: true, // optional (defaults to false)
	 connectionPool: 5 // options, 0=unlimited (defaults to 1)
});
```

Edit createMachine.ps1 to enter your nodejs hostname and orchestrator host name

```
$r= Invoke-WebRequest -URI "http://<YOUR_MACHINE_NAME_OR_IP>:8081/?machinename=$nm&robotname=bot-$nm&type=Development&user=$me"
```
and
```
$args="--connect -url https://<YOUR_ORCHESTRATOR_NAME> -key $r"
```

In the project folder, run: 
```
npm install
```

Launch manually: 
```
node server.js
```

## Caution
!!! Not for production, just a simple prototype !!!
