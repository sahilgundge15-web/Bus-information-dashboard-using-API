// Local fallback dataset if API fails
const fallbackBuses = [
    { number: "301", route: "Pune-Mumbai Express", source: "pune", destination: "Mumbai", status: "On Time" },
     { number: "105", route: "Pune-Satara Superfast", source: "pune", destination: "Mumbai", status: "On Time" },
    { number: "101", route: "City Center - Station", source: "Main Stand", destination: "Railway Station", status: "On Time" },
    { number: "202", route: "Airport - IT Park", source: "Airport", destination: "Tech Park", status: "Delayed" },
    { number: "303", route: "Market - University", source: "Central Market", destination: "University Gate", status: "Cancelled" },
    { number: "404", route: "Suburbs - Downtown", source: "West End", destination: "City Center", status: "On Time" }
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