var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

//need to be modified
async function callNFTVehicleSCParam(req){
	//console.log("OK");
	contractABI = utilities.getContainFile(contractABIPath);	//contractABIPath is a global variable
	contractByteCode = utilities.getContainFile(contractByteCodePath); //contractByteCodePath  is a global variable
	contractByteCodeObj = contractByteCode.object;
    const contractAdd = req.body.contractAdd; 
    const publicMethod = req.body.publicMethod; 	
	const tokenId = req.body.tokenId;	
	var y="";
	try {
		const { Web3 } = require('web3');
		const ws = await utilities.connectToServer();
		if(ws.Result==="Error") {
			throw new Error("9");			
		}else{
			console.log("Node is alive");
		}
		
		await new Promise(async (resolve,reject) => {
			try {
				console.log("Entré promise");
				const web3 = new Web3(Web3.givenProvider || blockchainAddress);
				const userContract = new web3.eth.Contract(contractABI,contractAdd);
				const contractAnswer = await userContract.methods[publicMethod](tokenId).call().then(function(result) {				
					//console.log(result);				
					resWB = {
						Result: "Success",					
						Value: result
					};
					y = JSON.parse(JSON.stringify(resWB, utilities.replacer));
					//fn(resHE);
				  }).catch((error)=>{
					errNum = "7"; 
					y = {
						Result: "Error",
						Num: errNum,
						Description : errorControl.errors(errNum) + " " + error
					}		
					console.log("Error8:" + error);
				  });
				web3.currentProvider.disconnect(); //after a request the connection must be closed
				resolve(y);
			}catch (error) {
                    resul = {
                        Result: "Error",                        
                        from:"0x0000000",
						Num : "11",
                        Description : error.message
                    }           
                    //console.log("Error6");
                    reject(resul);									
			}
			}).then((result) => {			
				y = result;
		  	})
		  	.catch((error) => {
				console.log("Error5 ownerof");
				y = error;
		  	});
		return y;
	}catch (e) {
		console.log("Error4");
		throw new Error(e.message);
	}
}

//modified
async function callGenesisIdenSC(req){
	//console.log("OK");
	contractABI = utilities.getContainFileJSON(contractABIPath);	//contractABIPath is a global variable
	//contractByteCode = utilities.getContainFile(contractByteCodeSource); //contractByteCodeSource  is a global variable    
	//contractByteCodeObj = contractByteCode.object;
    const contractAdd = req.body.contractAdd; 
    const publicMethod = req.body.publicMethod; 	

	var y="";
	try {
		const { Web3 } = require('web3');
		const ws = await utilities.connectToServer();
		if(ws.Result==="Error") {
			throw new Error("9");			
		}else{
			console.log("Node is alive");
		}
		
		await new Promise(async (resolve,reject) => {
			try {
				console.log("Entré promise");
				const web3 = new Web3(Web3.givenProvider || blockchainAddress);
                //console.log("web3 working");				
				const userContract = new web3.eth.Contract(contractABI,contractAdd);                
                //console.log("Ya tengo el contrato");				
				const contractAnswer = await userContract.methods[publicMethod]().call().then(function(result) {				                				
					console.log(result);				
					resWB = {
						Result: "Success",					
						Value: result
					};
					y = JSON.parse(JSON.stringify(resWB, utilities.replacer));
					//fn(resHE);
				  }).catch((error)=>{
					errNum = "7"; 
					y = {
						Result: "Error",
						Num: errNum,
						Description : errorControl.errors(errNum) + " " + error
					}		
					console.log("Error8:" + error);
				  });
				web3.currentProvider.disconnect(); //after a request the connection must be closed
				resolve(y);
			}catch (error) {
                    resul = {
                        Result: "Error",                        
                        from:"0x0000000",
						Num : "11",
                        Description : error.message
                    }           
                    console.log("Error6:" + error);
                    reject(resul);									
			}
			}).then((result) => {			
				y = result;
		  	})
		  	.catch((error) => {
				console.log("Error5");
				y = error;
		  	});
		return y;
	}catch (e) {
		console.log("Error4");
		throw new Error(e.message);
	}
}

//modified
initializer.consultMethodNotParams = async function (req, res){	
    //const contractAdd = req.body.contractAdd;	
    //const publicMethod = req.body.publicMethod; //public method or attribute
    const contractAdd = req.query.contractAdd;	
    const publicMethod = req.query.publicMethod; //public method or attribute	
	/*
    const contractAdd = req.headers.contractadd;	
    const publicMethod = req.headers.publicmethod; //public method or attribute
	*/
	var resul = {Result: "Success"};
	var obj={body:
			{	
                contractAdd:contractAdd,
                publicMethod: publicMethod				
			}};
	const errNum = errorControl.someFieldIsEmpty(obj);
	if(errNum){  //				
			resul = {
				Result: "Error",
				Num: errNum.toString(),
				Description : errorControl.errors(errNum)
			}	
			console.log("Error en ConsultInfo");	
			res.send(resul);
	}else{
			try {
				const response = await callGenesisIdenSC(obj).then((resul)=>{
					//let resHE = errorControl.handlingErrorOrNot(resul,manufacturerAdd);
					let resHE = JSON.parse(JSON.stringify(resul, utilities.replacer));					
					return resHE;
				}).catch((e)=>{
					console.log("Error0");
					y = {Result:e.message};
					return y;
				});
				if(response.Result==="9"){
					console.log("Error1");
					throw new Error("9");
				}else{
					res.send(response);
				}				
			} catch (error) {
				console.log("Error2"+ error.message);
				y = errorControl.connectionError(error.message,"0x0000000000");
				res.send(y); 
			}
	}
}

//need to be modified
initializer.consultMethodWithParams = async function (req, res){
	//var gas = req.body.gas;	
    const contractAdd = req.body.contractAdd;	
	const publicMethod = "ownerOf";
	const tokenId = req.body.tokenId;
	//var from = req.body.from;
	var resul = {Result: "Success"};
	var obj={body:
			{	//gas:gas,
                contractAdd:contractAdd,
                publicMethod: publicMethod,
				tokenId : tokenId
			}};
	const errNum = errorControl.someFieldIsEmpty(obj);
	if(errNum){  //				
			resul = {
				Result: "Error",
				Num: errNum.toString(),
				Description : errorControl.errors(errNum)
			}	
			console.log("Error en ConsultInfo");	
			res.send(resul);
	}else{
			try {
				const response = await callNFTVehicleSCParam(obj).then((resul)=>{
					//let resHE = errorControl.handlingErrorOrNot(resul,manufacturerAdd);
					let resHE = JSON.parse(JSON.stringify(resul, utilities.replacer));					
					return resHE;
				}).catch((e)=>{
					console.log("Error0");
					y = {Result:e.message};
					return y;
				});
				if(response.Result==="9"){
					console.log("Error1");
					throw new Error("9");
				}else{
					res.send(response);
				}				
			} catch (error) {
				console.log("Error2"+ error.message);
				y = errorControl.connectionError(error.message,"0x0000000000");
				res.send(y); 
			}
	}
}

module.exports = initializer;
