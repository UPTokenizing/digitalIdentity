//document on load of js
document.addEventListener("DOMContentLoaded", function () {


    const viewmodal = document.getElementById("ViewModal");
    let addresToOwner = "";
    // Función para agregar el eventListener a los botones
    async function attachButtonListeners() {
        document.querySelectorAll(".detailsBtn").forEach((button) => {
            if (!button.dataset.listenerAdded) {
                button.addEventListener("click", async function () {
                    addresToOwner = this.value; // Guardar valor del botón

                    // Encuentra la fila más cercana y su select
                    const row = this.closest("tr");
                    const selectElement = row.querySelector("select");
                    const contractAdd = row.children[2].textContent.trim(); // Extrae el contractAdd de la tercera celda

                    if (selectElement) {
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

    const closeModalV = document.getElementById("closeModalV");
    const cancelButtonV = document.getElementById("cancelButtonV");
    closeModalV.onclick = function () {
        viewmodal.style.display = "none";
    }
    cancelButtonV.onclick = function () {
        viewmodal.style.display = "none";
    }
    window.onclick = function (event) {
        if (event.target === viewmodal) {
            viewmodal.style.display = "none";
        }
    }

    const resultSideContainer = document.getElementById('result');
    const searchForm = document.getElementById('search-token-form');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // prevent page reload

        const input = document.getElementById('studentIDCN').value.trim();
        if (!input) return;

        resultSideContainer.classList.remove('hidden');
        resultSideContainer.innerHTML = `<p class="text-gray-500">Searching...</p>`;

        try {
            const response = await fetch('/api/searchStudent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Unknown error');

            const { students } = result;

            if (!students || students.length === 0) {
                resultSideContainer.innerHTML = `<p class="text-red-500">No results found.</p>`;
                return;
            }

            // Build the table
            const tableHTML = `
            <div class="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <table class="min-w-full bg-white dark:bg-gray-800">
                <thead>
                  <tr>
                    <th class="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-sm text-left font-semibold text-gray-700 dark:text-white">Student ID</th>
                    <th class="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-sm text-left font-semibold text-gray-700 dark:text-white">Complete Name</th>
                    <th class="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-sm text-left font-semibold text-gray-700 dark:text-white">Curriculum Address</th>
                    <th class="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-sm text-left font-semibold text-gray-700 dark:text-white">Achievements</th>
                    <th class="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-sm text-left font-semibold text-gray-700 dark:text-white"></th>
                  </tr>
                </thead>
                <tbody id="table-body">
                  ${await buildTableRows(students)}
                </tbody>
              </table>
            </div>
            `;

            resultSideContainer.innerHTML = tableHTML;
        } catch (err) {
            resultSideContainer.innerHTML = `<p class="text-red-500">${err.message}</p>`;
        }
    });

    async function getStudentCurriculmWithBC(birthCertificate, Institution) {
        const response = await fetch('/api/getStudentsCurriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ birthCertificate, Institution })
        });

        if (!response.ok) {
            console.error("Error getting student curriculum:", await response.text());
            return null; // or throw an error
        }

        const data = await response.json();
        return data.ScholarCurriculum;  // ← is this a stringified JSON? an object?
    }

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
    // Helper function to build table rows
    async function buildTableRows(students) {
        const Institution = "ScholarCurriculum";
        let rows = '';

        for (const student of students) {
            const { studentID, certificate_string } = student;
            const responseCurri = await getStudentCurriculmWithBC(certificate_string, Institution);
            const numAch = await fetchNumberOfAchievements(responseCurri);

            const name = await GetInfo(certificate_string, "name");
            const fLastName = await GetInfo(certificate_string, "fLastName");
            const mLastName = await GetInfo(certificate_string, "mLastName");
            let options = '<option value="">Select Achievement</option>';
            for (let i = 0; i < numAch; i++) {
                const ach = await fetchConsultCertificate(responseCurri, i);
                if (ach?.Achievement?.title) {
                    options += `<option value="${i}">${ach.Achievement.title}</option>`;
                }
            }

            rows += `
            <tr>
                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${studentID}</td>
                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${name} ${fLastName} ${mLastName}</td>
                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">${responseCurri}</td>
                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                    <select class="userTypeSelect border rounded px-2 py-1 bg-white text-gray-700 dark:bg-gray-700 dark:text-white">
                        ${options}
                    </select>
                </td>
                <td class="py-2 px-4 text-sm text-gray-700 dark:text-gray-300">
                    <button class="detailsBtn bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-500 p-2 rounded">Achievement Details</button>
                </td>
            </tr>
            `;
        }
        return rows;
    }

});