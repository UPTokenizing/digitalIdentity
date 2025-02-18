var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

async function callingRegisterUser(req) {
    contractABI = utilities.getContainFileJSON(contractABIPath); // contractABIPath is a global variable
    contractByteCodeObj = utilities.getContainFile(contractByteCodeSource); // contractByteCodeSource is a global variable
    const gas = req.body.gas;
    const contractAdd = req.body.contractAdd;
    const publicMethod = req.body.publicMethod;
    const userAddress = req.body.userAddress;
    const userType = req.body.userType;
    const government = req.body.government;
    var y = "";
    
    try {
        const { Web3 } = require('web3');
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
                const contractAnswer = await userContract.methods[publicMethod](
                    userAddress,
                    userType
                ).send({ from: government, gas: gas })
                    .on('receipt', function(receipt) {
                        receipt["Result"] = "Success";
                        y = receipt;
                    })
                    .on('error', function(error) {
                        errNum = "7";
                        y = {
                            Result: "Error",
                            Num: errNum,
                            Description: errorControl.errors(errNum) + " " + error
                        };
                        console.log("Error8: " + error);
                    });
                web3.currentProvider.disconnect(); // After a request, the connection must be closed
                resolve(y);
            } catch (error) {
                const resul = {
                    Result: "Error",
                    from: government,
                    Num: "11",
                    Description: error.message
                };
                console.log("Error6");
                reject(resul);
            }
        }).then((result) => {
            y = result;
        }).catch((error) => {
            console.log("Error5");
            y = error;
        });
        
        return y;
    } catch (e) {
        console.log("Error4");
        throw new Error(e.message);
    }
}

// Public function to register user
initializer.registerUser = async function(req, res) {
    const gas = req.body.gas;
    const contractAdd = req.body.contractAdd;
    const publicMethod = req.body.publicMethod;
    const userAddress = req.body.userAddress;
    const userType = req.body.userType;
    const government = req.body.government;

    var resul = { Result: "Success" };
    var obj = {
        body: {
            gas: gas,
            contractAdd: contractAdd,
            publicMethod: publicMethod,
            userAddress: userAddress,
            userType: userType,
            government: government
        }
    };

    const errNum = errorControl.someFieldIsEmpty(obj);
    if (errNum) {
        resul = {
            Result: "Error",
            Num: errNum.toString(),
            Description: errorControl.errors(errNum)
        };
        res.send(resul);
    } else {
        try {
            const response = await callingRegisterUser(obj).then((resul) => {
                let resHE = JSON.parse(JSON.stringify(resul, utilities.replacer));
                return resHE;
            }).catch((e) => {
                console.log("Error0");
                y = { Result: e.message };
                return y;
            });

            if (response.Result === "9") {
                console.log("Error1");
                throw new Error("9");
            } else {
                res.send(response);
            }
        } catch (error) {
            console.log("Error2" + error.message);
            y = errorControl.connectionError(error.message, government);
            res.send(y);
        }
    }
};

module.exports = initializer;
