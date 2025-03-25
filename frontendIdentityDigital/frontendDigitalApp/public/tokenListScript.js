document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('search-token-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
    
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
                    resultContentElement.textContent = 'Failed to retrieve info. Please try again or check the input data.';
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
                `/consultTokenCreator?contractAdd=${encodeURIComponent(data.contractAdd)}&contractToken=${encodeURIComponent(data.contractToken)}`,
            ];

            try {
                for (let i = 0; i < fetchEndpoints.length; i++) {
                    console.log(`Fetching: ${fetchEndpoints[i]}`); // Log each request
                    
                    const response = await fetch(fetchEndpoints[i], { method: 'GET' });
                    console.log(`Response status for ${fetchEndpoints[i]}:`, response.status); // Log status
                    
                    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
                    const resultText = await response.text(); // Read as text first
                    console.log(`Raw response text from ${fetchEndpoints[i]}:`, resultText); // Log raw response
            
                    const result = JSON.parse(resultText); // Convert to JSON manually
                    console.log(`Parsed JSON from ${fetchEndpoints[i]}:`, result); // Log parsed JSON
            
                    const resultElement = document.getElementById('result');
                    const resultContentElement = document.getElementById(`resultContent${i === 0 ? '' : i}`);
            
                    if (result.Result === "Error") {
                        resultElement.classList.remove('hidden');
                        resultContentElement.textContent = 'Failed to retrieve info. Please try again or check the input data.';
                    } else if (result.Result === "Success") {
                        resultElement.classList.remove('hidden');
            
                        // if (i === 0) {
                        //     resultContentElement.innerHTML = `More Info -> <a href="http://localhost:3000" target="_blank">Click Here</a>`;
                        // }
                        //  else 
                        if (i === 1) {
                            let link = "";
                            if (result.Value === "BirthCertificate") {
                                link = `<a href="http://localhost:5510" target="_blank">Click Here</a>`;
                            } else if (result.Value === "CurriculumUPGdl") {
                                link = `<a href="http://localhost:5513" target="_blank">Click Here</a>`;
                            }
                        
                            resultContentElement.innerHTML = `More Info -> ${link} <br>Token Name -> ${result.Value}`;
                        }
                         else if (i === 2) {
                            resultContentElement.textContent = `Government of the token -> ${result.Value}`;
                        }
                    } else {
                        resultElement.classList.remove('hidden');
                        resultContentElement.textContent = 'Unexpected result: ' + result.Result;
                    }
                }
            } catch (error) {
                console.error('Error during fetch:', error);
            }
            
        }
    });
});
