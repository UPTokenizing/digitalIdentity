//document on load of js
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("newServiceModal");
    const viewmodal = document.getElementById("ViewModal");
    let addresToOwner = "";
    // Función para agregar el eventListener a los botones
    async function attachButtonListeners() {
        const newServiceButtons = document.querySelectorAll(".newServiceButton");
        const detailsBtn = document.querySelectorAll(".detailsBtn");
        newServiceButtons.forEach(async (button) => {
            if (!button.dataset.listenerAdded) { // Evitar eventos duplicados
                button.addEventListener("click", function () {
                    modal.style.display = "block"; // Mostrar modal
                    addresToOwner = this.value;
                });

                button.dataset.listenerAdded = "true"; // Marcar como procesado
            }

        });
        document.querySelectorAll(".detailsBtn").forEach((button) => {
            if (!button.dataset.listenerAdded) {
                button.addEventListener("click", async function () {
                    addresToOwner = this.value; // Guardar valor del botón
                    // Encuentra la fila más cercana y su select
                    const row = this.closest("tr");
                    const selectElement = row.querySelector("select");
                    const contractAdd = row.children[2].textContent.trim(); // Extrae el contractAdd de la tercera celda

                    if (selectElement) {
                        // Obtener el valor numérico seleccionado
                        const selectedValue = selectElement.value;
                        if (parseInt(selectedValue) >= 0) {
                            viewmodal.style.display = "block"; // Mostrar modal
                            // Llamar a la función con los valores obtenidos
                            try {
                                const achievementData = await fetchConsultCertificate(contractAdd, selectedValue);
                                if (achievementData && achievementData.Achievement) {
                                    document.getElementById("titleV").textContent = achievementData.Achievement.title;
                                    document.getElementById("achievementIDV").textContent = achievementData.Achievement.id;
                                    document.getElementById("detailsV").textContent = achievementData.Achievement.details;
                                    document.getElementById("dateV").textContent = new Date(achievementData.Achievement.date * 1000).toLocaleDateString(); // Convierte la fecha Unix a formato legible
                                }
                            } catch (error) {
                                console.error("Error fetching achievement data:", error);
                            }
                        } else {
                            console.warn("No achievement selected.");
                        }
                    } else {
                        console.warn("No select element found in row.");
                    }
                });

                button.dataset.listenerAdded = "true"; // Evita duplicar eventos
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
    const closeModalV = document.getElementById("closeModalV");
    // Get cancel button
    const cancelButton = document.getElementById("cancelButton");
    const cancelButtonV = document.getElementById("cancelButtonV");

    // Listen for close click
    closeModal.onclick = function () {
        clearModalFields();
        modal.style.display = "none";
        viewmodal.style.display = "none";
    }

    closeModalV.onclick = function () {
        viewmodal.style.display = "none";
    }

    // Listen for cancel button click
    cancelButton.onclick = function () {
        clearModalFields();
        modal.style.display = "none";
        viewmodal.style.display = "none";
    }
    cancelButtonV.onclick = function () {
        viewmodal.style.display = "none";
    }

    // Listen for outside click
    window.onclick = function (event) {
        if (event.target === modal) {
            clearModalFields();
            modal.style.display = "none";
        }
    }
    window.onclick = function (event) {
        if (event.target === viewmodal) {
            viewmodal.style.display = "none";
        }
    }

    // Function to clear modal fields
    function clearModalFields() {

        document.getElementById('achievementID').value = '';
        document.getElementById('title').value = '';
        document.getElementById('details').value = '';
        document.getElementById('date').value = '';
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

    document.getElementById('create-service-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        // Additional data
        data.contractAdd = await getContractAdd();  // Assuming getContractAdd() gets the contract address
        data.gas = 300000;  // Set the gas value
        data.from = await getUserAdd();  // Assuming getUserAdd() gets the user address

        // Reformatear la data para que coincida con la estructura requerida
        const formattedData = {
            gas: data.gas,
            from: data.from,
            contractAdd: addresToOwner,  // Usando curriculumAdd en lugar de contractAdd
            id: data.achievementID,  // Renombrando achievementID a id
            title: data.title,
            date: data.date,
            details: data.details
        };

        // Get the date input value and convert to epoch
        const dateInput = document.getElementById("date").value;
        const epochTime = Math.floor(new Date(dateInput).getTime() / 1000); // Convert to seconds
        // Add the epoch timestamp to the data being sent to string
        formattedData.date = epochTime.toString();
        try {
            // Send data to backend
            const response = await fetch('/addAchievement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    });
    const getStudentCurriculmWithBC = async (birthCertificate, Institution) => {
        try {
            const response = await fetch('/api/getStudentsCurriculum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ birthCertificate, Institution }), // Send the body data
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve curriculum');
            }

            const data = await response.json();
            return data.ScholarCurriculum; // Return the curriculum data
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching');
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

    const fetchStudents = async () => {
        try {
            // Fetch student data from the backend API
            const response = await fetch('/api/getStudentsIDs');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the server');
            }

            const Institution = "ScholarCurriculum";
            const data = await response.json();
            const students = data.students || [];

            // Get the table body element
            const tableBody = document.getElementById('table-body');

            // Clear existing rows
            tableBody.innerHTML = "";

            // Use a for...of loop to handle asynchronous operations
            for (const student of students) {
                try {
                    const birthCertificate = student.certificate; // Store birth certificate
                    const studentID = student.studentID; // Extract student ID
                    // Fetch curriculum data for each student based on their birth certificate and institution
                    const responseCurri = await getStudentCurriculmWithBC(birthCertificate, Institution);
                    try {
                        const userAdd = birthCertificate; // Keeping birth certificate in this column

                        // Fetch the number of achievements for this curriculum
                        const numAch = await fetchNumberOfAchievements(responseCurri);



                        // Create a select element
                        const selectElement = document.createElement('select');
                        selectElement.className = "userTypeSelect border rounded px-2 py-1 bg-white text-gray-700 dark:bg-gray-700 dark:text-white";


                        // Default option
                        const defaultOption = document.createElement('option');
                        defaultOption.value = "";
                        defaultOption.textContent = "Select Achievement";
                        selectElement.appendChild(defaultOption);

                        // Add options for achievements
                        for (let i = 0; i < numAch; i++) {
                            const achievementData = await fetchConsultCertificate(responseCurri, i);
                            const achievementTittle = achievementData.Achievement.title;
                            if (achievementData) {
                                const option = document.createElement('option');
                                option.value = i;
                                option.textContent = achievementTittle; // Assuming it contains the name
                                selectElement.appendChild(option);
                            }
                        }

                        const name = await GetInfo(userAdd, "name");
                        const fLastName = await GetInfo(userAdd, "fLastName");
                        const mLastName = await GetInfo(userAdd, "mLastName");

                        // Create table row
                        const row = document.createElement('tr');
                        row.innerHTML = `
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${studentID}</td>
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${name} ${fLastName} ${mLastName}</td>
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${responseCurri}</td>
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300" dark:bg-gray-300"></td> <!-- Select will be appended here -->
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300"> 
                                    <button class="detailsBtn bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 p-2 rounded">Achievement Details</button>
                                </td>
                                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300"> 
                                <button class="newServiceButton bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 p-2 rounded" value="${responseCurri}">Add Achievement</button>
                            </td>                            
                            `;

                        // Append the populated select element to the corresponding `<td>`
                        row.children[3].appendChild(selectElement);

                        // Append row to table
                        tableBody.appendChild(row);

                        // Call function to attach button listeners after adding the new button
                        attachButtonListeners();
                    } catch (innerError) {
                        console.error(`Error processing curriculum for student ${student.studentID}:`, innerError);
                    }

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
    const updateDigitalID = async (Institution, tokenAddress, birthCertificates) => {
        try {
            if (!Institution || !tokenAddress || !birthCertificates) {
                throw new Error('Missing required parameters: Institution or tokenAddress or birthCertificates');
            }

            // Send a POST request to update the digital ID
            const response = await fetch('/api/updateCurriculum', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ Institution, tokenAddress, birthCertificates })
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error(`Failed to update DigitalIdentity: ${response.statusText}`);
            }
            // Parse the response JSON
            const data = await response.json();
            return data; // Return response data for further use if needed
        } catch (error) {
            console.error('Error updating DigitalIdentity:', error);
            return { error: error.message }; // Return error object
        }
    };
    fetchStudents();
    async function fetchNumberOfAchievements(data) {
        try {

            const response = await fetch(`/numberOfAchievements?contractAdd=${encodeURIComponent(data)}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            if (result.Result === "Error") {
                return result.Result;
            } else if (result.Result === "Success") {
                return result.TotalAchievements;
            } else {
                return result.Result;
            }
        } catch (error) {
            console.error('Error fetching numberOfAchievements:', error);
        }
    }
    async function fetchConsultCertificate(data, i) {
        try {
            const response = await fetch(`/consultCertificate?contractAdd=${encodeURIComponent(data)}&id=${encodeURIComponent(i)}`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const result = await response.json();
            if (result.Result === "Error") {
                return null;
            } else if (result.Result === "Success") {
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching consultCertificate:', error);
        }
    }
});