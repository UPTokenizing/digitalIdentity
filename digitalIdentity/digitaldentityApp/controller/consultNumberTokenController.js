var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

async function callnumberOfLinkedTokens(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Get ABI for the contract
    const contractAdd = req.query.contractAdd; // Get the contract address from the query
    let response = {};

    try {
        const { Web3 } = require('web3');
        
        // Connect to the blockchain node
        const ws = await utilities.connectToServer();
        if (ws.Result === "Error") {
            throw new Error("Blockchain node connection failed");
        }

        // Create a Web3 instance
        const web3 = new Web3(Web3.givenProvider || blockchainAddress);
        const userContract = new web3.eth.Contract(contractABI, contractAdd); // Create contract instance
        
        // Call the numberOfLinkedTokens function using the contract address
        const result = await userContract.methods.numberOfLinkedTokens().call();

        // Convert the result to a standard number
        const tokenCount = Number(result); // Convert BigInt/BigNumber to a regular number

        // Prepare the successful response
        response = {
            Result: "Success",
            Value: tokenCount // This will be the token's count
        };

        // Disconnect Web3 provider after the request
        web3.currentProvider.disconnect();
        return response;
        
    } catch (error) {
        console.log("Error during numberOfLinkedTokens call:", error);

        // Return an error if anything fails
        response = {
            Result: "Error",
            Description: error.message
        };
        return response;
    }
}

// Route handler for the numberOfLinkedTokens API
initializer.numberOfLinkedTokens = async function (req, res) {
    const contractAdd = req.query.contractAdd; // Contract address from query params
    
    // Check if the contract address is provided in the request
    if (!contractAdd) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameter: contractAdd"
        });
    }

    try {
        // Call the contract method to get the token's name
        const response = await callnumberOfLinkedTokens(req);

        // Return the response (Success or Error)
        res.send(response);
        
    } catch (error) {
        console.log("Error in numberOfLinkedTokens route:", error);

        // If there's any issue during the process, send an error response
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
