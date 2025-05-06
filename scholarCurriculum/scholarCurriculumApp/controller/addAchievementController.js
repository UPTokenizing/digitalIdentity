var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

async function addAchievementSC(req) {
    contractABI = utilities.getContainFileJSON(contractABIPath);
    contractByteCodeObj = utilities.getContainFile(contractByteCodeSource);

    const gas = req.body.gas;
    const from = req.body.from;
    const contractAdd = req.body.contractAdd;
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;
    const details = req.body.details;

    var response = "";

    try {
        const { Web3 } = require('web3');
        console.log("Processing request from: " + from);

        const ws = await utilities.connectToServer();
        if (ws.Result === "Error") {
            throw new Error("9");
        } else {
            console.log("Node is alive");
        }

        await new Promise(async (resolve, reject) => {
            try {
                const web3 = new Web3(Web3.givenProvider || blockchainAddress);
                const userContract = new web3.eth.Contract(contractABI, contractAdd);

                const nonce = await web3.eth.getTransactionCount(from);

                const contractAnswer = await userContract.methods.addAchievement(id, title, date, details).send({
                    from: from,
                    gas: gas,
                    gasLimit: "6721975",
                    gasPrice: "20000000000",
                    nonce: nonce
                }).on('receipt', function(receipt) {
                    response = {
                        "Result": "Success",
                        "transactionHash": receipt.transactionHash.toString(),
                        "gasUsed": receipt.gasUsed.toString(),
                        "blockNumber": receipt.blockNumber.toString(),
                        "blockHash": receipt.blockHash.toString(),
                        "from": receipt.from.toUpperCase(),
                        "fromorigin": from.toString()
                    };
                    console.log("Achievement added successfully:", response);
                }).on("error", function (error) {
                    console.log("Error: " + error + "\n from: " + from);
                    response = {
                        Result: "Error",
                        from: from,
                        Num: "11",
                        Description: error.message
                    };
                    console.log(response);
                });

                web3.currentProvider.disconnect();
                resolve(response);
            } catch (error) {
                console.log("Error in transaction: " + error);
                reject({ Result: "Error", Description: error.message });
            }
        }).then((result) => {
            response = result;
        }).catch((error) => {
            console.error("Promise rejected:", error.Result);
            response = error;
        });

        return response;
    } catch (e) {
        console.error("Error:", e.message);
        throw new Error(e.message);
    }
}

initializer.addAchievement = async function (req, res) {
    console.log("Request body:", req.body);

    const gas = req.body.gas;
    const from = req.body.from;
    const contractAdd = req.body.contractAdd;
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;
    const details = req.body.details;

    var result = { "Result": "Success" };

    const obj = {
        body: { gas, from, contractAdd, id, title, date, details }
    };

    const errNum = errorControl.someFieldIsEmpty(obj);
    if (errNum) {
        result = {
            "Result": "Error",
            "Num": errNum.toString(),
            "Description": errorControl.errors(errNum)
        };
        res.send(result);
    } else {
        console.log("Processing addAchievement request from: " + from);
        try {
            const response = await addAchievementSC(obj).then(resul => {
                return errorControl.handlingErrorOrNot(resul, from);
            }).catch((e) => {
                console.log("Error response: " + e.message);
                return { Result: e.message };
            });

            res.send(response);
        } catch (error) {
            result = errorControl.connectionError(error.message, from);
            res.send(result);
        }
    }
};

module.exports = initializer;
