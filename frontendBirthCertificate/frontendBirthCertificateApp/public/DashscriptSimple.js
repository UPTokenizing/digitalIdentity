//document on load of js
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("newServiceModal");

    let addresToOwner = "";
    // Función para agregar el eventListener a los botones
    function attachButtonListeners() {
        const newServiceButtons = document.querySelectorAll(".newServiceButton");

        newServiceButtons.forEach((button) => {
            if (!button.dataset.listenerAdded) { // Evitar eventos duplicados
                button.addEventListener("click", function () {
                    console.log("Botón clickeado:", this.value);
                    addresToOwner = this.value;
                    modal.style.display = "block"; // Mostrar modal
                });

                button.dataset.listenerAdded = "true"; // Marcar como procesado
            }
        });
    }



    // Observar cambios en el DOM
    const observer = new MutationObserver(() => {
        attachButtonListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Adjuntar eventos iniciales
    attachButtonListeners();




    // Get close button
    const closeModal = document.getElementById("closeModal");



    // Get cancel button
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





    //bool to say thta a new service is a child
    let isChild = false;
    let tempAdd = "";
    let replace = "";


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

    function loadContent(page) {
        fetch(page)
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => console.error('Error loading content:', error));
    }




    let contractAddresses = [];


    // Load contract addresses from localStorage when the page loads


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
            console.log('Contract Address Users:', data.contractAdd);
            return data.contractAdd; // Return the contract address

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching contract address');
        }
    };

    async function registerCertificate(certificateString) {
        console.log("To add ", certificateString)
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
            console.log("Certificate registered:", result); // Log the actual result

            if (response.ok) {
                console.log("Certificate successfully added:", certificateString);
            } else {
                console.error("Error adding certificate:", result.message);
            }
        } catch (error) {
            console.error("Error in API call:", error);
        }
    }

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

    document.getElementById('create-service-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        data.contractUser = await getContractAdd();
        data.gas = 3000000;
        data.government = await getUserAdd();
        data.owner = addresToOwner;

        console.log('Data:', data); // For debugging

        try {
            const response = await fetch('/createService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Await the response.json() to get the actual result
            const result = await response.json();
            console.log("resultado", result); // Log the actual result

            if (result.contractAddress) {

                await registerCertificate(result.contractAddress);
                //                console.log('Contract Address:', await getCertificates());

                clearModalFields();
                modal.style.display = "none";
                window.location.href = "/";






            }


            // window.location.reload();

        } catch (error) {
            console.error('Error:', error);
        }
    });



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
                console.log("Error not succeeded tofetch " + publicMethod);
            }
        } catch (error) {
            console.log(error);
        }
    }





    // Function to get gender and show modal with token fields updated
    async function updateToken(address, tokenToChange) {

        console.log(address, tokenToChange);

        try {
            console.log("aqui va el cambio ");
            isChild = true;
            tempAdd = address;
            replace = tokenToChange;
            // Fetch gender information (true for male, false for female)
            // Show the modal
            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching gender information:', error);
        }

    }



    window.viewDetails = async function (address) {
        modalView.style.display = "block";
        try {
            // Fetch information from the contract address
            const name = await GetInfo(address, "name");
            const fLastName = await GetInfo(address, "fLastName");
            const mLastName = await GetInfo(address, "mLastName");
            const gender = await GetInfo(address, "gender");
            //convertir la fecha a normal, no en epochhhhhhhhhhhhhhhhhhh
            const day = await GetInfo(address, "day");
            const month = await GetInfo(address, "month");
            const year = await GetInfo(address, "year");
            const state = await GetInfo(address, "state");
            const municipality = await GetInfo(address, "municipality");
            const dateCreation = await GetInfo(address, "dateCreation");
            let dateC = new Date(dateCreation * 1000);
            const dateLastUpdate = await GetInfo(address, "dateLastUpdate");
            let dateU = new Date(dateLastUpdate * 1000);
            const tokenFather = await GetInfo(address, "tokenFather");
            const tokenMother = await GetInfo(address, "tokenMother");
            const tokenDigIdentity = await GetInfo(address, "tokenDigIdentity");
            const owner = await GetInfo(address, "owner");
            const government = await GetInfo(address, "government");
            // Populate the HTML elements with the fetched information
            let genderType;
            if (gender) {
                genderType = "Male";
            }
            else {
                genderType = "Female";
            }
            document.getElementById('name2').textContent = name || 'N/A';
            document.getElementById('fLastName2').textContent = fLastName || 'N/A';
            document.getElementById('mLastName2').textContent = mLastName || 'N/A';
            document.getElementById('gender2').textContent = genderType || 'N/A';
            document.getElementById('day2').textContent = day || 'N/A';
            document.getElementById('month2').textContent = month || 'N/A';
            document.getElementById('year2').textContent = year || 'N/A';
            document.getElementById('state2').textContent = state || 'N/A';
            document.getElementById('municipality2').textContent = municipality || 'N/A';
            document.getElementById('dateCreation2').textContent = dateC.toLocaleString() || 'N/A';
            document.getElementById('dateLastUpdate2').textContent = dateU.toLocaleString() || 'N/A';
            document.getElementById('tokenFather2').textContent = tokenFather || 'N/A';
            document.getElementById('tokenMother2').textContent = tokenMother || 'N/A';
            document.getElementById('tokenDigIdentity2').textContent = tokenDigIdentity || 'N/A';
            document.getElementById('owner2').textContent = owner || 'N/A';
            document.getElementById('government2').textContent = government || 'N/A';
        } catch (error) {
            console.error('Error fetching information:', error);
        }
    }

    window.EditAddress = async function (address) {
        // First ensure the modal is displayed
        const modalEdit = document.getElementById("editAdress");
        if (modalEdit) {
            modalEdit.style.display = "block";
        }

        try {
            // Fetch information from the contract address
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
                    // Ensure getUserAdd() is called correctly with email
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



    fetchEmails();



});