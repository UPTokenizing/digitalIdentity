document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-token-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(formData);
        console.log(data);

        // Check contractToken
        if (data.contractToken === "" || data.contractToken === null) {
            try {
                const response = await fetch(`/consultNumberToken?contractAdd=${encodeURIComponent(data.contractAdd)}`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const result = await response.json();
                const resultElement = document.getElementById('result');
                const resultContentElement = document.getElementById('resultContent');

                if (result.Result === "Error") {
                    resultElement.classList.remove('hidden');
                    resultContentElement.textContent = 'Failed to create contract. Please try again or check the input data.';
                } else if (result.Result === "Success") {
                    console.log(result);
                    resultElement.classList.remove('hidden');
                    resultContentElement.textContent = `Linked Tokens ->  ${result.Value}`;
                } else {
                    resultElement.classList.remove('hidden');
                    resultContentElement.textContent = 'Unexpected result: ' + result.Result;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // Multiple fetch calls
            const fetchEndpoints = [
                `/consultNumberToken?contractAdd=${encodeURIComponent(data.contractAdd)}`,
                `/consultTokens?contractAdd=${encodeURIComponent(data.contractAdd)}&contractToken=${encodeURIComponent(data.contractToken)}`,
                `/consultTokenGovernment?contractAdd=${encodeURIComponent(data.contractAdd)}&contractToken=${encodeURIComponent(data.contractToken)}`,
            ];

            try {
                for (let i = 0; i < fetchEndpoints.length; i++) {
                    const response = await fetch(fetchEndpoints[i], { method: 'GET' });
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                    const result = await response.json();

                    const resultElement = document.getElementById('result');
                    const resultContentElement = document.getElementById(`resultContent${i === 0 ? '' : i}`);

                    if (result.Result === "Error") {
                        resultElement.classList.remove('hidden');
                        resultContentElement.textContent = 'Failed to retrieve info. Please try again or check the input data.';
                    } else if (result.Result === "Success") {
                        console.log(result);
                        resultElement.classList.remove('hidden');

                        // Modify the output based on the index
                        if (i === 0) {
                            resultContentElement.textContent = `Linked Tokens to this Identity -> ${result.Value}`;
                        } else if (i === 1) {
                            resultContentElement.textContent = `Token Name -> ${result.Value}`;
                        } else if (i === 2) {
                            resultContentElement.textContent = `Government of the token -> ${result.Value}`;
                        }
                    } else {
                        resultElement.classList.remove('hidden');
                        resultContentElement.textContent = 'Unexpected result: ' + result.Result;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });
});
