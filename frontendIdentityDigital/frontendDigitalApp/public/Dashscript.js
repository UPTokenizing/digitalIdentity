
document.addEventListener('DOMContentLoaded', function () {


    const getUserAdd = async () => {
        try {
          const email = localStorage.getItem('userEmail'); // Get the email from localStorage
          if (!email) {
            throw new Error('No email found in localStorage');
          }
  
          // Send a POST request to the server to get the user address
          const response = await fetch('/api/getUserAdd', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set content type to JSON
            },
            body: JSON.stringify({ email: email }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to retrieve user address');
          }
  
          // Parse the response JSON
          const data = await response.json();
          console.log('User Address:', data.UserAddress);
          return data.UserAddress; // Return the user address
  
        } catch (error) {
          console.error('Error fetching user address:', error);
        }
      };

      
document.getElementById('link-token-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(formData);
    console.log(data);

    try {
        // Await the resolved user address
        const userAddress = await getUserAdd();

        // Create an object with the input values
        const inputValues = {
            gas: 3000000, // Get gas amount
            contractAdd: data.contractAddress, // Get contract address
            contract2Add: data.tokenAddress, // Get token address
            nameToken: data.nameToken, // Get token name
            from: userAddress // Use the awaited address
        };

        console.log('Input Values for link:', inputValues); // For debugging

        const response = await fetch('/linkTokenService', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputValues)
        });

        const result = await response.json();

        // Display the result
        const resultElement = document.getElementById('result');
        const resultContentElement = document.getElementById('resultContent');

        // Check if the response indicates an error
        if (result.Result === "Error") {
            resultElement.classList.remove('hidden');
            resultContentElement.textContent = 'Failed to create contract. Please try again or check the input data.';
        } else if (result.Result === "Success") {
            console.log(result);
            resultElement.classList.remove('hidden');
            resultContentElement.textContent = `Linked Successfully`;
        } else {
            resultElement.classList.remove('hidden');
            resultContentElement.textContent = 'Unexpected result: ' + result.Result;
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

    const getContractAdd = async () => {
        try {
            // Send a POST request to the server to get the contract address
            const response = await fetch('/api/getContractAdd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type to JSON
                },
                body: JSON.stringify({}), // No need to send any data
            });

            // Handle the response
            if (!response.ok) {
                throw new Error('Failed to retrieve contract address');
            }

            // Parse the response JSON
            const data = await response.json();
            console.log('Contract Address:', data.contractAdd);
            return data.contractAdd; // Return the contract address

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching contract address');
        }
    };

    document.getElementById('create-digital-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log();

        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(formData);
        console.log(data);

        // Fetch the contract address
        const contractAddress = await getContractAdd(); // Await the contract address

        // Create an object with the input values
        const inputValues = {
            gas: 3000000, // Get gas amount
            government: "0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341", // Get contract address
            contractUser: contractAddress, // Use the awaited contract address
            owner: data.from // Get from address
        };

        console.log('Input Values:', inputValues); // For debugging

        try {
            const response = await fetch('/createDigitalIdentity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputValues)
            });

            const result = await response.json();

            // Display the result
            const resultElement = document.getElementById('resultCreate');
            const resultContentElement = document.getElementById('resultContentCreate');

            // Check if the response indicates an error
            if (result.Result === "Error") {
                resultElement.classList.remove('hidden');
                resultContentElement.textContent = 'Failed to create contract. Please try again or check the input data.';
            } else if (result.Result === "Success") {
                // Check if the contractAddress attribute exists
                if (result.contractAddress) {
                    resultElement.classList.remove('hidden');
                    resultContentElement.textContent = `${result.contractAddress}`;
                } else {
                    resultElement.classList.remove('hidden');
                    resultContentElement.textContent = 'Contract address not found in the response.';
                }
            } else {
                resultElement.classList.remove('hidden');
                resultContentElement.textContent = 'Unexpected result: ' + result.Result;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });




});
