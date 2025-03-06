var errorControl = require('./errors');
var utilities = require('./utilities');
var initializer = {};

// Function to get the total number of achievements
async function callGetNumberOfAchievements(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Load contract ABI
    const contractAdd = req.query.contractAdd; // Contract address
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
        
        // Call numberOfAchievements function
        const result = await userContract.methods.numberOfAchievements().call();

        // Return successful response
        response = {
            Result: "Success",
            TotalAchievements: parseInt(result, 10) // Convert result to integer
        };

        // Disconnect Web3 provider
        web3.currentProvider.disconnect();
        return response;
        
    } catch (error) {
        console.log("Error in getNumberOfAchievements call:", error);

        // Return an error response
        response = {
            Result: "Error",
            Description: error.message
        };
        return response;
    }
}

// API Route to get the total number of achievements
initializer.getNumberOfAchievements = async function (req, res) {
    const contractAdd = req.query.contractAdd; // Contract address

    // Check if contract address is provided
    if (!contractAdd) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameter: contractAdd"
        });
    }

    try {
        // Call function to retrieve the total number of achievements
        const response = await callGetNumberOfAchievements(req);

        // Send back response
        res.send(response);
        
    } catch (error) {
        console.log("Error in getNumberOfAchievements route:", error);

        // Return error response
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
