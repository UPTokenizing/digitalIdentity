var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

// Function to get the name of the token from a contract using getGovernmentOfToken
async function callgetGovernmentOfToken(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Get ABI for the contract
    const contractAdd = req.query.contractAdd; // Get the contract address from the query
    const contractToken = req.query.contractToken;
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
        
        // Call the getGovernmentOfToken function using the contract address
        const result = await userContract.methods.getGovernmentOfToken(contractToken).call();

        // Prepare the successful response
        response = {
            Result: "Success",
            Value: result // This will be the token's name
        };

        // Disconnect Web3 provider after the request
        web3.currentProvider.disconnect();
        return response;
        
    } catch (error) {
        console.log("Error during getGovernmentOfToken call:", error);

        // Return an error if anything fails
        response = {
            Result: "Error",
            Description: error.message
        };
        return response;
    }
}

// Route handler for the getGovernmentOfToken API
initializer.getGovernmentOfToken = async function (req, res) {
    const contractAdd = req.query.contractAdd; // Contract address from query params
    const contractToken = req.query.contractToken;
    
    // Check if the contract address is provided in the request
    if (!contractAdd || !contractToken) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameter: contractAdd"
        });
    }

    try {
        // Call the contract method to get the token's name
        const response = await callgetGovernmentOfToken(req);

        // Return the response (Success or Error)
        res.send(response);
        
    } catch (error) {
        console.log("Error in getGovernmentOfToken route:", error);

        // If there's any issue during the process, send an error response
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
