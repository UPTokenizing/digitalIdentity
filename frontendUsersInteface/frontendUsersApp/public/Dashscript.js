
document.addEventListener('DOMContentLoaded', function () {
    
document.getElementById('link-token-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log();
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    console.log(formData);
    console.log(data);

    // Create an object with the input values
    const inputValues = {
        gas: 300000, // Get gas amount
        contractAddress: "0x295865c0e1BfE88A898068aab9608f8277BF257D", // Get contract address
        tokenAddress: data.tokenAddress, // Get token address
        nameToken: data.nameToken, // Get token name
        from: "0x64D02158CbD8D1856440C14A1d5CFceBA80c804e" // Get from address
    };

    console.log('Input Values:', inputValues); // For debugging

    try {
        const response = await fetch('/linkTokenService', {
            method: 'POST',
            headers : { 'Content-Type': 'application/json' },
            body: JSON.stringify(inputValues)
        });

        const result = await response.json();

        // Display the result
        const resultElement = document.getElementById('result');
        const resultContentElement = document.getElementById('resultContent');

        resultElement.classList.remove('hidden');
        resultContentElement.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        console.error('Error:', error);
    }
});





});