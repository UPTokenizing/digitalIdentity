
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('curriculum-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log("Form submission prevented!");
        // Get form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        console.log(formData);

        try {
            // Await the resolved user address
            const userAddress = await getUserAdd();

            // Create an object with the input values
            const inputValues = {
                gas: 300000, // Get gas amount
                BirthCertificate: data.BirthCertificateAddress, // Get contract address
                studentID: data.studentID, // Get token address
                from: userAddress // Use the awaited address
            };

            console.log('Input Values for curriculum:', inputValues); // For debugging

            const response = await fetch('/createCurriculum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputValues)
            });

            const result = await response.json();

            // Display the result
            const resultElement = document.getElementById('result');
            const resultContentElement = document.getElementById('resultContent');

            // Check if the response indicates an error
            if (result.Result === "Error") {
                alert("Error during creation");
                resultElement.classList.remove('hidden');
                resultContentElement.textContent = 'Failed to create contract. Please try again or check the input data.';
            } else if (result.Result === "Success") {
                console.log(result);
                await updateBirthCertificateWithStudentID(data.studentID, data.BirthCertificateAddress)
                await updateScholarCurriculum(data.BirthCertificateAddress,result.contractAddress, "UpCurriculum");
                alert("Curriculum created successfully!");
                resultElement.classList.remove('hidden');
                resultContentElement.textContent = `Curriculum created successfully!`;
            } else {
                alert("Error during creation");
                resultElement.classList.remove('hidden');
                resultContentElement.textContent = 'Unexpected result: ' + result.Result;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function updateBirthCertificateWithStudentID(studentID, birthCertificate) {
        console.log(studentID, birthCertificate);

        const response = await fetch('/api/updateBirthCertificateWithStudentID', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentID, birthCertificate }),
        });

        const data = await response.json();
        console.log(data);
    }
    async function updateScholarCurriculum(birthCertificate, curriculumAdd,Institution) {
        console.log(birthCertificate, curriculumAdd,Institution);

        const response = await fetch('/api/updateScholarCurriculum', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ birthCertificate, curriculumAdd ,Institution}),
        });

        const data = await response.json();
        console.log(data);
    }


    // use this to not let creat more curriculums
    async function getStudentsIDs() {
        const response = await fetch('/api/getStudentsIDs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });

        const data = await response.json();
        console.log(data);
        return (data.BirthCertificate);
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
            console.log('Contract Address:', data.contractAdd);
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




});
