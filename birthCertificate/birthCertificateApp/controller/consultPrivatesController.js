const errorControl = require('./errors');
const utilities = require('./utilities');
const initializer = {};

async function callPrivateInfo(req) {
    const contractABI = utilities.getContainFileJSON(contractABIPath); // Get ABI for the contract
    const contractAdd = req.query.contractAdd; // Get the contract address from the query
    const fromAddress = req.query.from; // Dirección del usuario que hace la llamada
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

        console.log("Contract Address:", contractAdd);
        console.log("Using from:", fromAddress);

        // Verificar que fromAddress no sea undefined
        if (!fromAddress) {
            throw new Error("Missing required query parameter: from");
        }

        // Call all contract functions concurrently
        const [day, month, year, state, municipalty] = await Promise.all([
            userContract.methods.getDay().call({ from: fromAddress }),
            userContract.methods.getMonth().call({ from: fromAddress }),
            userContract.methods.getYear().call({ from: fromAddress }),
            userContract.methods.getState().call({ from: fromAddress }),
            userContract.methods.getMunicipalty().call({ from: fromAddress })
        ]);

        // Convert values if necessary
        response = {
            Result: "Success",
            Data: {
                Day: Number(day), 
                Month: Number(month), 
                Year: Number(year), 
                State: state, 
                Municipality: municipalty
            }
        };

        // Disconnect Web3 provider after the request
        web3.currentProvider.disconnect();
        return response;
        
    } catch (error) {
        console.log("Error during PrivateInfo call:", error);

        // Return an error if anything fails
        response = {
            Result: "Error",
            Description: error.message
        };
        return response;
    }
}

// Route handler for the PrivateInfo API
initializer.PrivateInfo = async function (req, res) {
    const contractAdd = req.query.contractAdd; // Contract address from query params
    const fromAddress = req.query.from; // Dirección del usuario que hace la llamada

    // Check if required parameters are provided
    if (!contractAdd || !fromAddress) {
        return res.send({
            Result: "Error",
            Description: "Missing required query parameters: contractAdd and/or from"
        });
    }

    try {
        // Call the contract method to get the information
        const response = await callPrivateInfo(req);

        // Return the response (Success or Error)
        res.send(response);

    } catch (error) {
        console.log("Error in PrivateInfo route:", error);

        // If there's any issue during the process, send an error response
        res.send({
            Result: "Error",
            Description: error.message
        });
    }
};

module.exports = initializer;
