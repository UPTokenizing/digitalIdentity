var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

// Function to serialize BigInt values in an object
function serializeBigInt(obj) {
    return JSON.parse(
        JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
        )
    );
}

// Function to call contract methods
async function callingGetInfo(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Smart contract ABI
    const contractAdd = req.query.contractAdd;
    const userAddress = req.query.userAddress;
    const publicMethods = ["getType", "getUserName", "getEmail", "getCreator"];
    let result = {};

    try {
        const { Web3 } = require('web3');
        const ws = await utilities.connectToServer();
        if (ws.Result === "Error") {
            throw new Error("Node connection failed.");
        }

        const web3 = new Web3(Web3.givenProvider || blockchainAddress);
        const userContract = new web3.eth.Contract(contractABI, contractAdd);

        // Call each getter method
        for (let method of publicMethods) {
            try {
                const response = await userContract.methods[method](userAddress).call();
                result[method] = response;
            } catch (error) {
                console.log(`Error calling ${method}: ${error.message}`);
                result[method] = `Error: ${error.message}`;
            }
        }

        web3.currentProvider.disconnect(); // Disconnect provider after use
        return { Result: "Success", Data: serializeBigInt(result) };
    } catch (error) {
        console.log("Error during getInfo: " + error.message);
        return {
            Result: "Error",
            Description: error.message
        };
    }
}

// Route for getInfo
initializer.getInfo = async function (req, res) {
    const contractAdd = req.query.contractAdd;
    const userAddress = req.query.userAddress;

    // Validate query parameters
    if (!contractAdd || !userAddress) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameters: contractAdd, userAddress"
        });
    }

    try {
        const response = await callingGetInfo(req);
        res.send(response);
    } catch (error) {
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
