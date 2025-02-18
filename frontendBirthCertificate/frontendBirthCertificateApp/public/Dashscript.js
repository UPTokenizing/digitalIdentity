//document on load of js
document.addEventListener("DOMContentLoaded", function () {


    const modal = document.getElementById("newServiceModal");
    const modalView = document.getElementById("viewServiceModal");
    const modalEdit = document.getElementById("editAdress");

    // Get open modal button
    const newServiceButton = document.getElementById("newServiceButton");

    // Get close button
    const closeModal = document.getElementById("closeModal");
    const closeModal2 = document.getElementById("closeModal2");
    const closeModal3 = document.getElementById("closeModal3");


    // Get cancel button
    const cancelButton = document.getElementById("cancelButton");
    const cancelButton2 = document.getElementById("cancelButton2");
    const cancelButton3 = document.getElementById("cancelButton3");




    // Listen for open click
    newServiceButton.onclick = function () {
        // Open modal
        modal.style.display = "block";
    }

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

    closeModal3.onclick = function () {
        modalEdit.style.display = "none";
    }

    // Listen for cancel button click
    cancelButton3.onclick = function () {
        modalEdit.style.display = "none";
    }

    // Listen for outside click
    window.onclick = function (event) {
        if (event.target === modalEdit) {
            modalEdit.style.display = "none";
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
        document.getElementById('owner').value = '';
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
    window.addEventListener('load', async () => {
        contractAddresses = await getCertificates();
        console.log("from teh event: ", contractAddresses);
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
            console.log('Contract Address Users:', data.contractAdd);
            return data.contractAdd; // Return the contract address

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching contract address');
        }
    };

    async function registerCertificate(certificateString) {
        console.log("To add ",certificateString)
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

                if (isChild) {

                    try {
                        console.log("creating child service");

                        const contractAdd = result.contractAddress; // Ensure result is defined
                        const replaceAdd = tempAdd;
                        const gas = 300000;
                        const government = await getUserAdd();

                        // Check if replace is defined
                        if (typeof replace === 'undefined') {
                            console.error('The variable "replace" is not defined.');
                            return; // Exit if replace is not defined
                        }

                        let publicMethod = ""; // Use let instead of const
                        if (replace === "tokenMother") {
                            publicMethod = "setMotherAddress";
                        } else if (replace === "tokenFather") {
                            publicMethod = "setFatherAddress";
                        }

                        const requestData = {
                            contractAdd,
                            replaceAdd,
                            gas,
                            government,
                            publicMethod
                        };

                        console.log(requestData);
                        const response = await fetch('/setAddress', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        });

                        const apiResponse = await response.json();

                        console.log("Lo seteado", apiResponse);

                        // Check if apiResponse is defined and has the expected structure
                        if (apiResponse && apiResponse.Result === 'Success') {
                            tempAdd = "";
                            replace = "";
                            isChild = false;
                            // Refresh the page
                            // window.location.reload();
                        } else {
                            // Show error alert
                            alert('Invalid Data');
                        }

                    } catch (error) {
                        console.error('Error:', error);
                        // Show error alert
                        alert('Invalid Data');
                    }


                }


            }

            updateTableRows(contractAddresses);
            // window.location.reload();

        } catch (error) {
            updateTableRows(contractAddresses);
            console.error('Error:', error);
        }
    });

    document.getElementById('editAddressForm').addEventListener('submit', async (event) => {
        event.preventDefault();


        // Get values from span elements
        const contractAdd = document.getElementById('address3').textContent;
        const government = document.getElementById('government3').textContent;

        // Get the selected option from the select element
        const publicMethod = document.getElementById('tokenChange2').value;

        // Get the new address from input
        const replaceAdd = document.getElementById('newAdd').value;

        // Set default gas value or get it from somewhere if needed
        const gas = '300000'; // You can adjust this value as needed

        // Create data object with the exact structure needed
        const requestData = {
            contractAdd,
            replaceAdd,
            gas,
            government,
            publicMethod
        };

        try {
            const response = await fetch('/setAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();

            // Check if result is 'Success'
            if (result.Result === 'Success') {
                // Refresh the page
                window.location.reload();
            } else {
                // Show error alert
                alert('Invalid Data');
            }

        } catch (error) {
            console.error('Error:', error);
            // Show error alert
            alert('Invalid Data');
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

            let date = new Date(dateOfCreation * 1000);

            const tr = document.createElement('tr');
            tr.className = 'border-t dark:border-gray-600';

            tr.innerHTML = `
          
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white flex items-center">
              ${name} ${fLastName} ${mLastName}
          </td>
          <td class="py-2 px-4 text-sm text-blue-500 dark:text-blue-400">${address}</td>
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white">${date.toLocaleString()}</td>
          <td class="py-2 px-4 text-sm text-gray-700 dark:text-white text-right">
              <div>
                  <button data-id="1" class="hidden dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing new-child-button">
                      <i class="fas fa-plus"></i> New Child  
                  </button>
                  <button data-id="2" class="hidden dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing" onclick="EditAddress('${address}')">
                      <i class="fas fa-edit"></i> Edit an Address  
                  </button>
                  <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing" onclick="viewDetails('${address}')">
                      <i class="fas fa-eye"></i> View  
                  </button>
                  <button data-id="3" class="hidden dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing">
                      <i class="fas fa-trash"></i> Delete  
                  </button>
              </div>
          </td>
      `;
            tbody.appendChild(tr);

            // Add event listener for the new child button
            tr.querySelector('.new-child-button').onclick = async function () {
                console.log("New Child");
                const gender = await GetInfo(address, "gender");
                if (gender) {
                    // It's the father
                    await updateToken(address, "tokenFather");
                } else if (gender === false) {
                    // It's the mother
                    await updateToken(address, "tokenMother");
                }
            };
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


});