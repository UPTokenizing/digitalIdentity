var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};


async function createGIdentitySC(req) {

	contractABI = utilities.getContainFileJSON(contractABIPath);	//contractABIPath is a global variable	
	//contractJSONCode = utilities.getContainFile(contractJSONPath); //contractJSONPath  is a global variable
	//contractByteCodeObj = utilities.getContainFile(contractABIPath); //contractByteCodeSource  is a global variable	
	contractByteCodeObj = utilities.getContainFile(contractByteCodeSource); //contractByteCodeSource  is a global variable	
	//console.log(contractByteCodeObj);
	//contractByteCodeObj = contractJSONCode.object;	
	const gas = req.body.gas;
	const name = req.body.name;
	const fLastName = req.body.fLastName;
	const mLastName = req.body.mLastName;
	const sex = req.body.sex;
	const day = req.body.day;
	const month = req.body.month;
	const year = req.body.year;
	const state = req.body.state;
	const municipality = req.body.municipality;
	const contractUser = req.body.contractUser;
	const from = req.body.from;
	var y = "";
	try {
		const { Web3 } = require('web3');
		console.log("Entró1: " + from);
		const ws = await utilities.connectToServer();
		if (ws.Result === "Error") {
			throw new Error("9");
		} else {
			console.log("Node is alive");
		}
		// ----------------------------------------------		
		await new Promise(async (resolve, reject) => {
			//const provider = new Web3.providers.WebsocketProvider(blockchainAddress);
			//provider.on('connect', async (resul) => {
			console.log("Entró2: " + from);
			try {
				const web3 = new Web3(Web3.givenProvider || blockchainAddress);
				const userContract = new web3.eth.Contract(contractABI);
				console.log("Entró3: " + from);
				const nonce = await web3.eth.getTransactionCount(from);
				const contractAnswer = await userContract.deploy({ data: contractByteCodeObj, arguments: [name, fLastName, mLastName, sex, day, month, year, state, municipality, contractUser] }).send(
					{ from: from, gas: gas, gasLimit: "6721975", gasPrice: "20000000000", nonce: nonce }).on('receipt', function (receipt) {
						console.log("Entró4: " + from);
						//from = from.toUpperCase();
						const fromRet = receipt.from.toUpperCase();
						if (from.toUpperCase() === fromRet) {
							y = {
								"Result": "Success",
								"transactionHash": receipt.transactionHash.toString(),
								"contractAddress": receipt.contractAddress.toString(),
								"gasUsed": receipt.gasUsed.toString(),
								"blockNumber": receipt.blockNumber.toString(),
								"blockHash": receipt.blockHash.toString(),
								"from": fromRet.toString(),
								"fromorigin": from.toString()
							};
							console.log(y);
							//console.log("Success: from:" + from + "\n" + "fromRet:" + fromRet + "\n" + "nonce:" + nonce );
							//console.log("Success: from:" + from + "\n" + "fromRet:" + fromRet);
						} else {
							y = {
								"Result": "ErrRare",
								"transactionHash": receipt.transactionHash.toString(),
								"contractAddress": receipt.contractAddress.toString(),
								"gasUsed": receipt.gasUsed.toString(),
								"blockNumber": receipt.blockNumber.toString(),
								"blockHash": receipt.blockHash.toString(),
								"from": fromRet.toString(),
								"fromorigin": from.toString()
							};
							//console.log("ErrRare: from:" + from + "\n" + "fromRet:" + fromRet + "\n" + "nonce:" + nonce );
							console.log("ErrRare: from:" + from + "\n" + "fromRet:" + fromRet);
						}
					}).on("error", function (error) {
						console.log("Error: " + error + "\n from: " + from);
						y = { //antes tenía resul
							Result: "Error",
							from: from,
							Num: "11",
							Description: error.message
						}
						console.log(y);
					});
				console.log(y);
				web3.currentProvider.disconnect(); //after a request the connection must be closed
				resolve(y);
			} catch (error) {
				console.log("Entre al error de conexión 10" + error);
				resul = {
					Result: "Error",
					from: from,
					Num: "11",
					Description: error.message
				}
				console.log(resul);
				reject(resul);
			}
		}).then((result) => {
			//console.log("Promise resolved:", result.Result);
			y = result;
		})
			.catch((error) => {
				console.error("Promise rejected:", error.Result);
				y = error;
			});
		//console.log("Imprimo pero espero promise: " + from);
		return y;
	} catch (e) {
		console.error("Error:", e.message);
		throw new Error(e.message);
	}
}


initializer.createGIdentity = async function (req, res) {
	const gas = req.body.gas;
	const name = req.body.name;
	const fLastName = req.body.fLastName;
	const mLastName = req.body.mLastName;
	const sex = req.body.sex;
	const day = req.body.day;
	const month = req.body.month;
	const year = req.body.year;

	const state = req.body.state;
	const municipality = req.body.municipality;
	const contractUser = req.body.contractUser;

	const from = req.body.government;
	console.log("Request from: " + from);
	var resul = { "Result": "Success" };
	//It is required that all variables contain values (not empty)
	const obj = {
		body:
		{
			gas: gas,
			name: name,
			fLastName: fLastName,
			mLastName: mLastName,
			sex: sex,
			day: day,
			month: month,
			year: year,
			state: state,
			municipality: municipality,
			contractUser: contractUser,
			from: from
		}
	};
	const errNum = errorControl.someFieldIsEmpty(obj);
	if (errNum) {  //				
		resul = {
			"Result": "Error",
			"Num": errNum.toString(),
			"Description": errorControl.errors(errNum)
		}
		res.send(resul);
	} else {
		console.log("Processing request from: " + from);
		try {
			const response = await createGIdentitySC(obj).then(resul => {
				let resHE = errorControl.handlingErrorOrNot(resul, from);
				return resHE;
			}).catch((e) => {
				console.log("sending error from: " + from + "\nError:" + e.message);
				y = { Result: e.message };
				return y;
			});
			if (response.Result === "9") {
				throw new Error("9");
			} else {
				res.send(response);
			}
		} catch (error) {
			y = errorControl.connectionError(error.message, from);
			res.send(y);
		}

	}

}

module.exports = initializer;