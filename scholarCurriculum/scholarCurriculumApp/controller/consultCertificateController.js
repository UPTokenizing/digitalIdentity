var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

// Function to get achievement details
async function callGetAchievement(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Load contract ABI
    const contractAdd = req.query.contractAdd; // Contract address
    const achievementID = parseInt(req.query.id, 10); // Achievement ID (must be an integer)
    let response = {};

    try {
        const { Web3 } = require('web3');
        
        // Connect to the blockchain node
        const ws = await utilities.connectToServer();
        if (ws.Result === "Error") {
            throw new Error("Blockchain node connection failed");
        }

        // Create Web3 instance
        const web3 = new Web3(Web3.givenProvider || blockchainAddress);
        const userContract = new web3.eth.Contract(contractABI, contractAdd); // Load contract instance
        
        // Call getAchievement function from the smart contract
        const result = await userContract.methods.getAchievement(achievementID).call();

        // Return successful response
        response = {
            Result: "Success",
            Achievement: JSON.parse(result) // Parse JSON string returned from Solidity
        };

        // Disconnect Web3 provider
        web3.currentProvider.disconnect();
        return response;
        
    } catch (error) {
        console.log("Error in getAchievement call:", error);

        // Return an error response
        response = {
            Result: "Error",
            Description: error.message
        };
        return response;
    }
}

// API Route to get an achievement
initializer.getAchievement = async function (req, res) {
    const contractAdd = req.query.contractAdd; // Contract address
    const achievementID = req.query.id; // Achievement ID

    // Check if required parameters are provided
    if (!contractAdd || !achievementID) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameters: contractAdd, id"
        });
    }

    try {
        // Call function to retrieve achievement
        const response = await callGetAchievement(req);

        // Send back response
        res.send(response);
        
    } catch (error) {
        console.log("Error in getAchievement route:", error);

        // Return error response
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
