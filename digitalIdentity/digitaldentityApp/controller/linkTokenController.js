var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

async function linkTokenSC(req) {
    contractABI = utilities.getContainFileJSON(contractABIPath); 
    contractByteCodeObj = utilities.getContainFile(contractByteCodeSource); 

    const gas = req.body.gas;
    const from = req.body.from;
    const contractAdd = req.body.contractAdd;
    const contract2Add = req.body.contract2Add;  // Address of the token contract to be linked
    const _nameToken = req.body.nameToken;  // Name of the token to be linked
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
                const userContract = new web3.eth.Contract(contractABI,contractAdd);

                console.log("Entró2: " + from);

                const nonce = await web3.eth.getTransactionCount(from);
                console.log("Entró3: " + from);

                // Calling the linkToken method in DigitalIdentity contract
                const contractAnswer = await userContract.methods.linkToken(contract2Add, _nameToken).send({
                    from: from,
                    gas: gas,
                    gasLimit: "6721975",
                    gasPrice: "20000000000",  
                    nonce: nonce
                }).on('receipt', function(receipt) {
                    const fromRet = receipt.from.toUpperCase();
                    console.log("Entro receipt");
                    if (from.toUpperCase() === fromRet) {
                        y = {
                            "Result": "Success",
                            "transactionHash": receipt.transactionHash.toString(),
                            "gasUsed": receipt.gasUsed.toString(),
                            "blockNumber": receipt.blockNumber.toString(),
                            "blockHash": receipt.blockHash.toString(),
                            "from": fromRet.toString(),
                            "fromorigin": from.toString()
                        };
                        console.log("Token linked successfully:", y);
                    } else {
                        y = {
                            "Result": "ErrRare",
                            "transactionHash": receipt.transactionHash.toString(),
                            "gasUsed": receipt.gasUsed.toString(),
                            "blockNumber": receipt.blockNumber.toString(),
                            "blockHash": receipt.blockHash.toString(),
                            "from": fromRet.toString(),
                            "fromorigin": from.toString()
                        };
                        console.log("Error in linking token: from address mismatch");

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

                console.log("Link token result:", y);
                web3.currentProvider.disconnect();  // Disconnect the provider after the request is complete
                resolve(y);
            } catch (error) {
                console.log("Error in connection or linking token: " + error);
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

initializer.linkToken = async function (req, res) {

    console.log("Request body:", req.body);

    const gas = req.body.gas;
    const from = req.body.from; //owner
    const contract2Add = req.body.contract2Add; 
    const contractAdd = req.body.contractAdd;  // Address of the token contract to link
    const _nameToken = req.body.nameToken;  // Token name to link
    console.log("Request from: " + from);
    var resul = { "Result": "Success" };

    // It is required that all variables contain values (not empty)
    const obj = {
        body: {
            gas: gas,
            from: from,
            contract2Add: contract2Add,
            contractAdd: contractAdd,
            nameToken: _nameToken
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
            const response = await linkTokenSC(obj).then(resul => {
                let resHE = errorControl.handlingErrorOrNot(resul, from);
                return resHE;
            }).catch((e) => {
                console.log("Sending error from: " + from + "\nError:" + e.message);
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
