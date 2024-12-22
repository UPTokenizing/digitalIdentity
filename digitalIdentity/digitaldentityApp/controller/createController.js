var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

async function createDIdentitySC(req) {
    contractABI = utilities.getContainFileJSON(contractABIPath); // contractABIPath is a global variable
    contractByteCodeObj = utilities.getContainFile(contractByteCodeSource); // contractByteCodeSource is a global variable

    const gas = req.body.gas;
    const owner = req.body.owner;
    const from = req.body.from;
    const contractUser = req.body.contractUser;  // Added this to pass the second argument
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
            try {
                const web3 = new Web3(Web3.givenProvider || blockchainAddress);
                const userContract = new web3.eth.Contract(contractABI); // Create contract object
                
                console.log("Entró2: " + from);

                const nonce = await web3.eth.getTransactionCount(from);
                console.log("Entró3: " + from);

                // Deploying the contract
                const contractAnswer = await userContract.deploy({
                    data: contractByteCodeObj,
                    arguments: [owner, contractUser]  // Pass both owner and contractUser to the constructor
                }).send({
                    from: from,
                    gas: gas,
                    gasLimit: "6721975",
                    gasPrice: "20000000000", // Can be dynamic based on the current network
                    nonce: nonce
                }).on('receipt', function(receipt) {
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
                        console.log("Contract deployed successfully:", y);
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
                        console.log("Error in transaction: from address mismatch");
                    }
                }).on("error", function (error) {
                    console.log("Error: " + error + "\n from: " + from);
                    y = {
                        Result: "Error",
                        from: from,
                        Num: "11",
                        Description: error.message
                    };
                    console.log(y);
                });

                console.log("Deployment result:", y);
                web3.currentProvider.disconnect(); // After a request the connection must be closed
                resolve(y);
            } catch (error) {
                console.log("Error in connection or deployment: " + error);
                resul = {
                    Result: "Error",
                    from: from,
                    Num: "11",
                    Description: error.message
                };
                console.log(resul);
                reject(resul);
            }
        }).then((result) => {
            y = result;
        }).catch((error) => {
            console.error("Promise rejected:", error.Result);
            y = error;
        });

        return y;
    } catch (e) {
        console.error("Error:", e.message);
        throw new Error(e.message);
    }
}

initializer.createDIdentity = async function (req, res) {
    const gas = req.body.gas;
    const owner = req.body.owner;
    const from = req.body.government;
    const contractUser = req.body.contractUser;  // Added this field to request body
    console.log("Request from: " + from);
    var resul = { "Result": "Success" };

    // It is required that all variables contain values (not empty)
    const obj = {
        body: {
            gas: gas,
            owner: owner,
            from: from,
            contractUser: contractUser  // Make sure this is passed in the request
        }
    };
    const errNum = errorControl.someFieldIsEmpty(obj);
    if (errNum) {
        resul = {
            "Result": "Error",
            "Num": errNum.toString(),
            "Description": errorControl.errors(errNum)
        };
        res.send(resul);
    } else {
        console.log("Processing request from: " + from);
        try {
            const response = await createDIdentitySC(obj).then(resul => {
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
};

module.exports = initializer;
