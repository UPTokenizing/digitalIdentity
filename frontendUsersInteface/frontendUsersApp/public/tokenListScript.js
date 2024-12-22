document.addEventListener('DOMContentLoaded', function () {
    
    function updateTableRows() {
    // Add console log to check if function is being called
    console.log('updateTableRows function called');

    // Find the tbody element and log it
    const tbody = document.querySelector('tbody');
    console.log('tbody element:', tbody);

    // Check if tbody exists before trying to modify it
    if (!tbody) {
        console.error('No tbody element found in the document');
        return;
    }

    // Default entry
    const defaultAddresses = [
        {
            address: '0x0000000000000000000000000000000000000000',
            name: 'user A'
        }
    ];

    // Clear existing rows
    tbody.innerHTML = '';

    defaultAddresses.forEach(contract => {
        const tr = document.createElement('tr');
        tr.className = 'border-t dark:border-gray-600';

        tr.innerHTML = `
            <td class="py-2 px-4 text-sm text-gray-700 dark:text-white">
                ${contract.name}
            </td>
            <td class="py-2 px-4 text-sm text-blue-500 dark:text-blue-400">
                ${contract.address}
            </td>
        `;
        tbody.appendChild(tr);
        
        // Log when row is added
        console.log('Row added:', contract);
    });
}

// Ensure the DOM is fully loaded before running
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    updateTableRows();
});

// Also add a fallback window load event
window.addEventListener('load', function() {
    console.log('Window loaded');
    updateTableRows();
});

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateTableRows);


});