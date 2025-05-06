//document on load of js
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("newServiceModal");
    let addresToOwner = "";
    async function attachButtonListeners() {
        const newServiceButtons = document.querySelectorAll(".newServiceButton");
        newServiceButtons.forEach(async (button) => {
            if (!button.dataset.listenerAdded) {
                button.addEventListener("click", function () {
                    modal.style.display = "block";
                    addresToOwner = this.value;
                });

                button.dataset.listenerAdded = "true";
            }
            // Check if the button should be disabled
            let bt = await getBirthCertificate(button.value);
            if (bt !== null && bt !== "" && bt !== undefined && bt !== "null" && bt !== "No Birth Certificate found") {
                button.disabled = true;
                button.style.cursor = "cursor";
                button.style.opacity = 0;

            }
        });
    }
    // Observar cambios en el DOM
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    attachButtonListeners();
    const closeModal = document.getElementById("closeModal");
    const cancelButton = document.getElementById("cancelButton");
    // Listen for close click
    closeModal.onclick = function () {
        clearModalFields();
        modal.style.display = "none";
    }
    // Listen for cancel button click
    cancelButton.onclick = function () {
        clearModalFields();
        modal.style.display = "none";
    }
    // Listen for outside click
    window.onclick = function (event) {
        if (event.target === modal) {
            clearModalFields();
            modal.style.display = "none";
        }
    }
    // Function to clear modal fields
    function clearModalFields() {
        document.getElementById('name').value = '';
        document.getElementById('fLastName').value = '';
        document.getElementById('mLastName').value = '';
        document.getElementById('sex').selectedIndex = 0; // Reset to the first option
        document.getElementById('day').value = '';
        document.getElementById('month').value = '';
        document.getElementById('year').value = '';
        document.getElementById('state').value = '';
        document.getElementById('municipality').value = '';
    }

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

    async function registerCertificate(certificateString) {
        try {
            const response = await fetch('/api/registerCertificate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ certificateString })
            });

            // Await the response.json() to get the actual result
            const result = await response.json();
            if (response.ok) {
                console.warn("Certificate successfully added");
            } else {
                console.error("Error adding certificate:", result.message);
            }
        } catch (error) {
            console.error("Error in API call:", error);
        }
    }
    //UserAddress function with local loggin email
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
            return data.UserAddress; // Return the user address
        } catch (error) {
            console.error('Error fetching user address:', error);
        }
    };

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
            } else {
                console.warn("Error not succeeded tofetch " + publicMethod);
            }
        } catch (error) {
            console.error(error);
        }
    }
    //UserAddress function with email
    const getUserAdd2 = async (email) => {
        try {
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
            return data.UserAddress; // Return the user address
        } catch (error) {
            console.error('Error fetching user address:', error);
        }
    };

    async function updateBirthCertificate(usAdd, bt) {
        const userAddress = usAdd;
        const birthCertificate = bt;

        const response = await fetch('/api/updateBirthCertificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress, birthCertificate }),
        });
        const data = await response.json();
    }

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

    const fetchEmails = async () => {
        try {
            // Fetch data from the backend API
            const response = await fetch('/api/getAllEmails');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the server');
            }
            const data = await response.json();
            // Extract email data from the response
            const emails = data.emails || [];
            // Get the table body element
            const tableBody = document.getElementById('table-body');
            // Clear existing rows
            tableBody.innerHTML = "";
            // Get contract address here
            const contractAddress = await getContractAdd();
            // Use a for...of loop to handle asynchronous operations
            for (const email of emails) {
                try {
                    const userAdd = await getUserAdd2(email); // Assuming getUserAdd will work correctly now with email

                    const userInfo = await getUserInfo(contractAddress, userAdd); // Assuming userAdd is valid
                    const userType = getUserTypeString(userInfo.Data.getType);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                      <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${email}</td>
                      <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${userAdd}</td>
                      <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${userType}</td>
                      <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300"> 
    <button class="newServiceButton bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-700  dark:hover:bg-blue-500 p-2 rounded" value="${userAdd}">New</button>
</td>

                  `;
                    tableBody.appendChild(row);
                } catch (innerError) {
                    console.error(`Error fetching address for email ${email}:`, innerError);
                }
            }
        } catch (error) {
            // Display error message in the response container
            const responseContainer = document.getElementById('response-container');
            responseContainer.innerHTML = `<p class="text-red-500 text-sm">${error.message}</p>`;
        }
    };

    window.viewDetails = async function (address) {
        modalView.style.display = "block";
        const fields = [
            "name", "fLastName", "mLastName", "gender", "day", "month", "year",
            "state", "municipality", "dateCreation", "dateLastUpdate",
            "tokenFather", "tokenMother", "tokenDigIdentity", "owner", "government"
        ];

        try {
            const values = await Promise.all(fields.map(f => GetInfo(address, f)));
            const data = Object.fromEntries(fields.map((f, i) => [f, values[i]]));

            const date = ts => new Date(ts * 1000).toLocaleString();
            const genderText = data.gender ? "Male" : "Female";

            const map = {
                name2: data.name, fLastName2: data.fLastName, mLastName2: data.mLastName,
                gender2: genderText, day2: data.day, month2: data.month, year2: data.year,
                state2: data.state, municipality2: data.municipality,
                dateCreation2: date(data.dateCreation), dateLastUpdate2: date(data.dateLastUpdate),
                tokenFather2: data.tokenFather, tokenMother2: data.tokenMother,
                tokenDigIdentity2: data.tokenDigIdentity, owner2: data.owner, government2: data.government
            };

            Object.entries(map).forEach(([id, val]) => {
                document.getElementById(id).textContent = val || 'N/A';
            });

        } catch (e) {
            console.error('Error fetching information:', e);
        }
    };

    window.EditAddress = async function (address) {
        // First ensure the modal is displayed
        const modalEdit = document.getElementById("editAdress");
        if (modalEdit) {
            modalEdit.style.display = "block";
        }
        try {
            const government = await GetInfo(address, "government");
            // Get elements with error checking
            const elements = {
                government: document.getElementById('government3'),
                contractAddress: document.getElementById('address3')
            };
            if (elements.government) {
                elements.government.textContent = government || 'N/A';
            } else {
                console.warn('Element with ID "government3" not found');
            }
            elements.contractAddress.textContent = address || 'N/A';
        } catch (error) {
            console.error('Error in EditAddress:', error);
        }
    }

    document.getElementById('create-service-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        data.contractUser = await getContractAdd();
        data.gas = 3000000;
        data.government = await getUserAdd();
        data.owner = addresToOwner;
        try {
            const response = await fetch('/createService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.contractAddress) {

                await registerCertificate(result.contractAddress);
                await updateBirthCertificate(data.owner, result.contractAddress);

                clearModalFields();
                modal.style.display = "none";
                window.location.href = "/";
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    fetchEmails();
});