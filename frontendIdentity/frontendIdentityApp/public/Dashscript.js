document.addEventListener('DOMContentLoaded', function () {


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



  // Function to clear modal fields
  function clearModalFields() {
    const tokenFatherField = document.getElementById('tokenFather');
    const tokenMotherField = document.getElementById('tokenMother');

    // tokenFatherField.value = 'papa';
    tokenFatherField.disabled = false;

    // tokenMotherField.value = 'mama';
    tokenMotherField.disabled = false;
    // Clear all input fields in the form
    document.getElementById('gas').value = '';
    document.getElementById('name').value = '';
    document.getElementById('fLastName').value = '';
    document.getElementById('mLastName').value = '';
    document.getElementById('sex').selectedIndex = 0; // Reset to the first option
    document.getElementById('day').value = '';
    document.getElementById('month').value = '';
    document.getElementById('year').value = '';
    document.getElementById('state').value = '';
    document.getElementById('municipality').value = '';
    document.getElementById('tokenFather').value = '';
    document.getElementById('tokenMother').value = '';
    document.getElementById('from').value = '';
  }




  // Repeat for any additional cancel buttons as needed


  // Create an array to store contract addresses

  // Create an array to store contract addresses
  let contractAddresses = [];

  // Function to load addresses from txt file
  async function loadAddressesFromTxt() {
    try {
      const response = await fetch('contractAddresses.txt');
      if (!response.ok) {
        throw new Error('Could not fetch contract addresses from file');
      }
      const text = await response.text();
      // Split the text by newlines and filter out any empty lines
      const addresses = text.split('\n').filter(address => address.trim());
      return addresses;
    } catch (error) {
      console.error('Error loading addresses from file:', error);
      return [];
    }
  }

  // Function to remove duplicates and update storage
  function removeDuplicates(addresses) {
    // Convert to Set and back to Array to remove duplicates
    const uniqueAddresses = [...new Set(addresses)];

    // Update localStorage with cleaned array
    if (uniqueAddresses.length > 0) {
      localStorage.setItem('contractAddresses', JSON.stringify(uniqueAddresses));
    }

    return uniqueAddresses;
  }

  // Load contract addresses from localStorage when the page loads
  window.addEventListener('load', async () => {
    const savedAddresses = localStorage.getItem('contractAddresses');

    if (savedAddresses) {
      contractAddresses = JSON.parse(savedAddresses);
    }

    // Load from txt file only if contractAddresses is empty
    if (contractAddresses.length === 0) {
      contractAddresses = await loadAddressesFromTxt();
    }

    // Remove duplicates regardless of source
    contractAddresses = removeDuplicates(contractAddresses);

    updateTableRows(); // Update the table with the cleaned data
  });

  document.getElementById('create-service-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Get values from disabled input fields
    const tokenFatherField = document.getElementById('tokenFather');
    const tokenMotherField = document.getElementById('tokenMother');

    // Create an object with the input values, regardless of disabled state
    const inputValues = {
      tokenFather: tokenFatherField.value || data.tokenFather,
      tokenMother: tokenMotherField.value || data.tokenMother,
      // Add any other fields you need to check
    };

    // Merge form data with input values
    const mergedData = {
      ...data,
      ...inputValues
    };

    console.log('Merged Data:', mergedData); // For debugging

    try {
      const response = await fetch('/createService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mergedData)
      });

      const result = await response.json();

      if (result.contractAddress && !contractAddresses.includes(result.contractAddress)) {
        contractAddresses.push(result.contractAddress);
        contractAddresses = removeDuplicates(contractAddresses);
        localStorage.setItem('contractAddresses', JSON.stringify(contractAddresses));

        await updateContractAddressesFile(contractAddresses);

        clearModalFields();
        modal.style.display = "none";
      }

      updateTableRows();
      alert('Service created successfully!');

    } catch (error) {
      updateTableRows();
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
    const fAddress = document.getElementById('newAdd').value;

    // Set default gas value or get it from somewhere if needed
    const gas = '300000'; // You can adjust this value as needed

    // Create data object with the exact structure needed
    const requestData = {
      contractAdd,
      fAddress,
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
      const response = await fetch(`/consult-data?contractAdd=${encodeURIComponent(address)}&publicMethod=${encodeURIComponent(publicMethod)}`, {
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
  async function updateTableRows() {
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
            <td class="py-2 px-4 text-sm text-gray-700 dark:text-white">
                <input type="checkbox">
            </td>
            <td class="py-2 px-4 text-sm text-gray-700 dark:text-white flex items-center">
                ${name} ${fLastName} ${mLastName}
            </td>
            <td class="py-2 px-4 text-sm text-blue-500 dark:text-blue-400">${address}</td>
            <td class="py-2 px-4 text-sm text-gray-700 dark:text-white">${date.toLocaleString()}</td>
            <td class="py-2 px-4 text-sm text-gray-700 dark:text-white text-right">
                <div>
                    <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing new-child-button">
                        <i class="fas fa-plus"></i> New Child  
                    </button>
                    <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing" onclick="EditAddress('${address}')">
                        <i class="fas fa-edit"></i> Edit an Address  
                    </button>
                    <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing" onclick="viewDetails('${address}')">
                        <i class="fas fa-eye"></i> View  
                    </button>
                    <button class="dark:text-white dark:hover:text-gray-400 hover:text-gray-500 text-gray-700 button-spacing">
                        <i class="fas fa-trash"></i> Delete  
                    </button>
                </div>
            </td>
        `;
      tbody.appendChild(tr);

      // Add event listener for the new child button
      tr.querySelector('.new-child-button').onclick = async function () {
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

    const tokenFatherField = document.getElementById('tokenFather');
    const tokenMotherField = document.getElementById('tokenMother');

    try {
      // Fetch gender information (true for male, false for female)

      if (tokenToChange === "tokenFather") {
        // Male: Set tokenFather to the address, disable the field, and clear tokenMother
        tokenFatherField.value = address;
        tokenFatherField.disabled = true;
        tokenMotherField.value = ''; // Clear tokenMother field
        tokenMotherField.disabled = false;
      } else {
        // Female: Set tokenMother to the address, disable the field, and clear tokenFather
        tokenMotherField.value = address;
        tokenMotherField.disabled = true;
        tokenFatherField.value = ''; // Clear tokenFather field
        tokenFatherField.disabled = false;
      }

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
      const government = await GetInfo(address, "government");
      // Populate the HTML elements with the fetched information
      let genderType;
      if (gender) {
        genderType="Male";
      }
      else{
        genderType="Female";
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