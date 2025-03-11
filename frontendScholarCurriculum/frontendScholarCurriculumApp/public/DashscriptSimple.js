//document on load of js
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("newServiceModal");

    let addresToOwner = "";
    // Función para agregar el eventListener a los botones
    async function attachButtonListeners() {
        const newServiceButtons = document.querySelectorAll(".newServiceButton");

        newServiceButtons.forEach(async (button) => {
            if (!button.dataset.listenerAdded) { // Evitar eventos duplicados
                button.addEventListener("click", function () {
                    console.log("Botón clickeado:", this.value);
                    modal.style.display = "block"; // Mostrar modal
                    addresToOwner = this.value;
                });

                button.dataset.listenerAdded = "true"; // Marcar como procesado
            }

            // Check if the button should be disabled
            // let bt = await getBirthCertificate(button.value);
            // console.log(bt);
            // if (bt !== null && bt !== "" && bt !== undefined && bt !== "null" && bt !== "No Birth Certificate found") {
            //     button.disabled = true;
            //     button.style.cursor = "cursor";
            //     button.style.opacity = 0;
                
            // }
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


    // Function to clear modal fields
    function clearModalFields() {

        document.getElementById('achievementID').value = '';
        document.getElementById('title').value = '';
        document.getElementById('details').value = '';
        document.getElementById('date').value = '';
        document.getElementById('curriculumAdd').value = '';
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
            console.log('Contract Address Users:', data.contractAdd);
            return data.contractAdd; // Return the contract address

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching contract address');
        }
    };


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


    const fetchStudents = async () => {
        try {
            // Fetch student data from the backend API
            const response = await fetch('/api/getStudentsIDs');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the server');
            }
    
            const data = await response.json();
            const students = data.students || [];
    
            // Get the table body element
            const tableBody = document.getElementById('table-body');
    
            // Clear existing rows
            tableBody.innerHTML = "";
    
            // Get contract address here
            const contractAddress = await getContractAdd();
    
            // Use a for...of loop to handle asynchronous operations
            for (const student of students) {
                try {
                    const birthCertificate = student.certificate; // Store birth certificate
                    const studentID = student.studentID; // Extract student ID
    
                    // Fetch user address using the birth certificate
                    const userAdd = birthCertificate; // Keeping birth certificate in    this column
                    console.log(contractAddress, "+" , userAdd);
                    const userInfo = await getUserInfo(contractAddress, userAdd);
                    
                    console.log(userInfo);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${studentID}</td>
                        <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${userAdd} -> Brandon</td>
                        <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                            <select class="userTypeSelect border rounded px-2 py-1">
                                <option value="">Select Achievement</option>
                                <option value="0">Dechatlon Academico</option>
                            </select>
                        </td>
                        <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300"> 
                            <button class="newServiceButton bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 p-2 rounded" value="${userAdd}">Add Achievement</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                } catch (innerError) {
                    console.error(`Error processing student ${student.studentID}:`, innerError);
                }
            }
        } catch (error) {
            // Display error message in the response container
            const responseContainer = document.getElementById('response-container');
            responseContainer.innerHTML = `<p class="text-red-500 text-sm">${error.message}</p>`;
        }
    };
    



    fetchStudents();

    async function updateBirthCertificate(usAdd, bt) {
        console.log(usAdd, bt);
        const userAddress = usAdd;  // Replace with actual user address
        const birthCertificate = bt;  // Replace with actual certificate value

        const response = await fetch('/api/updateBirthCertificate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userAddress, birthCertificate }),
        });

        const data = await response.json();

        console.log(data);
    }





});