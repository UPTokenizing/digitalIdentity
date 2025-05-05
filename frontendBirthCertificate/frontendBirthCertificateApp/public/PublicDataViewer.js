//document on load of js
document.addEventListener("DOMContentLoaded", function () {
    const modalView = document.getElementById("viewServiceModal");
    // Get close button
    const closeModal2 = document.getElementById("closeModal2");
    // Get cancel button
    const cancelButton2 = document.getElementById("cancelButton2");
    
    closeModal2.onclick = function () {
        modalView.style.display = "none";
    }

    // Listen for cancel button click
    cancelButton2.onclick = function () {
        modalView.style.display = "none";
    }

    // Listen for outside click
    window.onclick = function (event) {
        if (event.target === modalView) {
            modalView.style.display = "none";
        }
    }

    let contractAddresses = [];
   
    window.addEventListener('load', async () => {
        contractAddresses = await getCertificates();
        updateTableRows(contractAddresses); // Update the table with the cleaned data
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
            return data.contractAdd; // Return the contract address
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching contract address');
        }
    };
    async function getCertificates() {
        try {
            const response = await fetch('/api/getCertificates', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Await the response.json() to get the actual result
            const result = await response.json();
            if (response.ok) {
                return result.certificates;  // Return the certificates array
            } else {
                throw new Error("Error retrieving certificates: " + result.message);
            }
        } catch (error) {
            console.error("Error in API call:", error);
            throw error;  // Rethrow the error for handling elsewhere
        }
    }
    async function GetInfo(address, publicMethod) {
        try {
            // Fetching data from your backend endpoint using GET request with query parameters
            const response = await fetch(`/consult?contractAdd=${encodeURIComponent(address)}&publicMethod=${encodeURIComponent(publicMethod)}`, {
                method: 'GET'
            });
            // Check if the response is OK (status in the range 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Parse the response as JSON
            const result = await response.json();
            // Check if the result indicates success
            if (result.Result === "Success") {
                if (typeof result.Value === 'object' && result.Value !== null) {
                    // If Value is an object, return the nested "value"
                    return result.Value.value; // Extract the value property
                } else {
                    // Otherwise, return the value directly if it's a string
                    return result.Value;
                }
            } else {     }
        } catch (error) {
            console.error(error);
        }
    }
    // Function to update the table rows based on contractAddresses array
    async function getBirthCertificate(usAd) {
        const userAddress = usAd;  // Replace with actual user address
        const response = await fetch('/api/getBirthCertificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress }),
        });
        const data = await response.json();
        return (data.BirthCertificate);
    }
    // Function to update the table rows based on contractAddresses array
    async function updateTableRows(contractAddresses) {
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // Clear existing rows

        for (const address of contractAddresses) {
            // Fetch all required information
            const name = await GetInfo(address, "name");
            const fLastName = await GetInfo(address, "fLastName");
            const mLastName = await GetInfo(address, "mLastName");
            const dateOfCreation = await GetInfo(address, "dateCreation");
            // Skip this iteration if essential data is missing
            if (!name || !fLastName || !mLastName || !dateOfCreation) {
                continue; // Skip to the next address
            }
            let owner = await GetInfo(address, "owner");
            // let date = new Date(dateOfCreation * 1000);
            let date = await getBirthCertificate(owner);
            const tr = document.createElement('tr');
            tr.className = 'border-t dark:border-gray-600';
            tr.innerHTML = `
        
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white flex items-center">
              ${name} ${fLastName} ${mLastName}
          </td>
          <td class="py-2 px-4 text-sm text-blue-500 dark:text-blue-400">${address}</td>
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white">${owner}</td>
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white text-right">
              <div>
                  <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing" onclick="viewDetails('${address}')">
                      <i class="fas fa-eye"></i> View  
                  </button>
                  
              </div>
          </td>
      `;
            tbody.appendChild(tr);


        }
    }
    async function getUserInfo(contractAdd, userAddress) {
        try {
            const response = await fetch(`/getInfoUser?contractAdd=${encodeURIComponent(contractAdd)}&userAddress=${encodeURIComponent(userAddress)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }
    async function getDigIdentityAdd(userAdd) {
        try {
            const contractAddress = await getContractAdd(); // Wait for contract address
            const userAddress = userAdd; // Wait for user address

            if (contractAddress && userAddress) {
                const userInfoDef = await getUserInfo(contractAddress, userAddress);
                if (userInfoDef) {
                    return userInfoDef.Data.getDigIdentityAdd;
                } else {
                    console.error('No user info found');
                }
            } else {
                console.error('Missing contract address or user address');
            }
        } catch (error) {
            console.error('Error during DOMContentLoaded:', error);
        }
    }
    async function getUserFromBirthC(address) {
        try {
            const response = await fetch('/api/getUserFromBirthC', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ birthCertificate: address }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            // Only call response.json() once and store the result
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching information:', error);
            return null;
        }
    }

    window.viewDetails = async function (address) {
        modalView.style.display = "block";
        try {
            const [name, fLastName, mLastName, gender, day, month, year, state, municipality, dateCreation, dateLastUpdate, tokenFather, tokenMother, owner, government] =
                await Promise.all(["name", "fLastName", "mLastName", "gender", "day", "month", "year", "state", "municipality", "dateCreation", "dateLastUpdate", "tokenFather", "tokenMother", "owner", "government"].map(f => GetInfo(address, f)));
    
            const usAdds = await getUserFromBirthC(address);
            const tokenDigIdentity = await getDigIdentityAdd(usAdds.UserAddress);
    
            const formatDate = t => new Date(t * 1000).toLocaleString();
            const genderType = gender ? "Male" : "Female";
    
            const fields = {
                name2: name, fLastName2: fLastName, mLastName2: mLastName,
                gender2: genderType, day2: day || "Unauthorized", month2: month || "Unauthorized", year2: year || "Unauthorized",
                state2: state || "Unauthorized", municipality2: municipality || "Unauthorized",
                dateCreation2: formatDate(dateCreation), dateLastUpdate2: formatDate(dateLastUpdate),
                tokenFather2: tokenFather, tokenMother2: tokenMother,
                tokenDigIdentity2: tokenDigIdentity, owner2: owner, government2: government
            };
    
            Object.entries(fields).forEach(([id, val]) => {
                document.getElementById(id).textContent = val || 'N/A';
            });
    
        } catch (error) {
            console.error('Error fetching information:', error);
        }
    };
});