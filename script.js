// Local fallback dataset if API fails
const fallbackBuses = [
    { number: "MH-01-AB-1001", route: "Mumbai - Pune", source: "Mumbai", destination: "Pune", status: "On Time" },
    { number: "MH-02-CD-1002", route: "Pune - Mumbai", source: "Pune", destination: "Mumbai", status: "Running" },
    { number: "MH-03-EF-1003", route: "Mumbai - Nashik", source: "Mumbai", destination: "Nashik", status: "On Time" },
    { number: "MH-04-GH-1004", route: "Nashik - Pune", source: "Nashik", destination: "Pune", status: "Delayed" },
    { number: "MH-05-JK-1005", route: "Pune - Kolhapur", source: "Pune", destination: "Kolhapur", status: "On Time" },
    { number: "MH-06-LM-1006", route: "Kolhapur - Sangli", source: "Kolhapur", destination: "Sangli", status: "Running" },
    { number: "MH-07-NP-1007", route: "Nagpur - Amravati", source: "Nagpur", destination: "Amravati", status: "On Time" },
    { number: "MH-08-QR-1008", route: "Aurangabad - Pune", source: "Aurangabad", destination: "Pune", status: "Delayed" },
    { number: "MH-09-ST-1009", route: "Mumbai - Thane", source: "Mumbai", destination: "Thane", status: "On Time" },
    { number: "MH-10-UV-1010", route: "Thane - Navi Mumbai", source: "Thane", destination: "Navi Mumbai", status: "Running" },
    { number: "MH-11-WX-1011", route: "Pune - Satara", source: "Pune", destination: "Satara", status: "On Time" },
    { number: "MH-12-YZ-1012", route: "Pune - Ahmednagar", source: "Pune", destination: "Ahmednagar", status: "Delayed" },
    { number: "MH-13-AA-1013", route: "Solapur - Pune", source: "Solapur", destination: "Pune", status: "On Time" },
    { number: "MH-14-BB-1014", route: "Nashik - Mumbai", source: "Nashik", destination: "Mumbai", status: "Running" },
    { number: "MH-15-CC-1015", route: "Ratnagiri - Mumbai", source: "Ratnagiri", destination: "Mumbai", status: "On Time" },
    { number: "MH-16-DD-1016", route: "Raigad - Mumbai", source: "Raigad", destination: "Mumbai", status: "Cancelled" },
    { number: "MH-17-EE-1017", route: "Chandrapur - Nagpur", source: "Chandrapur", destination: "Nagpur", status: "On Time" },
    { number: "MH-18-FF-1018", route: "Dhule - Nashik", source: "Dhule", destination: "Nashik", status: "Running" },
    { number: "MH-19-GG-1019", route: "Akola - Nagpur", source: "Akola", destination: "Nagpur", status: "Delayed" },
    { number: "MH-20-HH-1020", route: "Jalgaon - Aurangabad", source: "Jalgaon", destination: "Aurangabad", status: "On Time" }
];
let allBuses = [];

// Fetch data from a live REST API placeholder (or fallback gracefully)
async function fetchBusData() {
    try {
        // You can replace this URL with your actual live backend endpoint REST API
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!response.ok) throw new Error("API request failed");
        
        // Transforming placeholder API structure to match bus layout structure
        allBuses = fallbackBuses; 
        renderDashboard(allBuses);
    } catch (error) {
        console.warn("Using fallback data due to network error:", error);
        allBuses = fallbackBuses;
        renderDashboard(allBuses);
    }
}

// Render data into metrics and table rows
function renderDashboard(buses) {
    const tableBody = document.getElementById("busTableBody");
    tableBody.innerHTML = "";

    let onTimeCount = 0;
    let delayedCount = 0;

    if (buses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="no-data">No matching records found.</td></tr>`;
    }

    buses.forEach(bus => {
        if (bus.status === "On Time") onTimeCount++;
        if (bus.status === "Delayed") delayedCount++;

        let statusClass = "on-time";
        if (bus.status === "Delayed") statusClass = "delayed";
        if (bus.status === "Cancelled") statusClass = "cancelled";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${bus.number}</strong></td>
            <td>${bus.route}</td>
            <td>${bus.source}</td>
            <td>${bus.destination}</td>
            <td><span class="badge ${statusClass}">${bus.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

    // Update Counter Elements
    document.getElementById("totalBuses").innerText = buses.length;
    document.getElementById("onTime").innerText = onTimeCount;
    document.getElementById("delayedBuses").innerText = delayedCount;
}

// Filter and Search logic combined
function filterBuses() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const selectedStatus = document.getElementById("statusFilter").value;

    const filtered = allBuses.filter(bus => {
        const matchesQuery = 
            bus.number.toLowerCase().includes(query) ||
            bus.route.toLowerCase().includes(query) ||
            bus.source.toLowerCase().includes(query) ||
            bus.destination.toLowerCase().includes(query);

        const matchesStatus = (selectedStatus === "all") || (bus.status === selectedStatus);

        return matchesQuery && matchesStatus;
    });

    renderDashboard(filtered);
}

// Event Listeners Initialization
document.addEventListener("DOMContentLoaded", () => {
    fetchBusData();
});

document.getElementById("searchInput").addEventListener("input", filterBuses);
document.getElementById("statusFilter").addEventListener("change", filterBuses);

document.getElementById("refreshBtn").addEventListener("click", () => {
    document.getElementById("searchInput").value = "";
    document.getElementById("statusFilter").value = "all";
    fetchBusData();
});
