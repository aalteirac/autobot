var express = require("express");
var bodyParser = require("body-parser");


var app = express();
var port = process.env.PORT || 8081;

var util = require('util');
var Orchestrator = require('uipath-orchestrator');
var orchestrator = new Orchestrator({
	 tenancyName: 'default',           // The Orchestrator Tenancy
	 usernameOrEmailAddress: 'admin',// The Orchestrator login
	 password: '',               // The Orchestrator password
	 hostname: 'localhost', // The instance hostname
	 isSecure: true,                // optional (defaults to true)
	 port: 443, // optional (defaults to 80 or 443 based on isSecure)
	 invalidCertificate: true, // optional (defaults to false)
	 connectionPool: 5 // options, 0=unlimited (defaults to 1)
});


app.use(bodyParser.urlencoded({
  extended: true
}));

//in: machine name, robot name, robot type, user
//check if machine exist, check robot exist, create machine, get Key, get machine id create bot return result
app.get("/", async function(request, response) {
	if(request.query.machinename && request.query.robotname && request.query.type && request.query.user){
		var key;
		try{
		  var id= await getMachineID(request.query.machinename);
		  if(id=="NOID"){
			//machine doesn't exist, lets' create ii
			key=await createMachine(request.query.machinename);	
			console.log("Machine created",key,id);
		  }
		  else{
			//machine exist, let's get the key  
			key= await getMachineKey(id);
			console.log("Machine already created",key,id);
			
		  }
		  id= await getMachineID(request.query.machinename);
		  //create bot
		  //console.log(parseInt(id),request.query.machinename,request.query.robotname,request.query.user,request.query.type,"");
		  var bot=await createRobot(parseInt(id),request.query.machinename,request.query.robotname,request.query.user,request.query.type,"");
		  response.send(bot);	  
		  //var key=await createMachine(request.query.cpt);	
		  //response.send("OK " +key);
		}
		catch(err){
			response.send(err)
		}
	}
	else{
		response.send("wrong request, expecting cpt parameter...")
	}		

});

function getMachineKey(id){
	return new Promise((resolve,reject)=>{
		var apiPath=`/odata/Machines(${id})`
		var apiQuery={};
		orchestrator.get(apiPath, apiQuery, function (err, data) {
			if(err){
				if(data.message)
					reject(data.message)
				else
					reject(err);
			}
			else{
				if(data.LicenseKey){
					resolve(data.LicenseKey);
					//console.log(data)
				}
				else{
					resolve("NOID")
				}
			}
		})
	})
}

function getMachineID(name){
	return new Promise((resolve,reject)=>{
		var apiPath=`/odata/Machines?$filter=((contains(Name,%27${name}%27)))`
		var apiQuery={};
		orchestrator.get(apiPath, apiQuery, function (err, data) {
			if(err){
				if(data.message)
					reject(data.message)
				else
					reject(err);
				console.log("KO");
			}
			else{
				if(data.value && data.value.length==1){
					resolve(data.value[0].Id);
				}
				else{
					resolve("NOID")
				}
			}
		})
	})
}

function createRobot(machineID,machineName,name,user,type,pass){
	return new Promise((resolve,reject)=>{
		var apiPath="/odata/Robots"
		var apiQuery = {"MachineName":`${machineName}`,"MachineId":parseInt(machineID),"Username":`${user}`,"Description":null,"Type":`${type}`,"HostingType":"Standard","Password":`${pass}`,"Name":`${name}`,"ExecutionSettings":{},"CredentialType":"Default"};
		console.log(apiQuery);
		orchestrator.post(apiPath, apiQuery, function (err, data) {
			if(err){
				if(data.message)
					reject(data.message)
				else
					reject(err);
			}
			else{
				resolve(data.LicenseKey);
			}
		})
	})
}

function createMachine(name){
	return new Promise((resolve,reject)=>{
		var apiPath="/odata/Machines"
		var apiQuery = {"Name":`${name}`,"Type":"Standard","LicenseKey":null};
		orchestrator.post(apiPath, apiQuery, function (err, data) {
			if(err){
				if(data.message)
					reject(data.message)
				else
					reject(err);
			}
			else{
				resolve(data.LicenseKey);
			}
		})
	})
}
app.listen(port,function(){
  console.log("Server listening to port 8081");
});
