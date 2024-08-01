
const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude }); // Send geolocation data to server
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        }
    );
} else {
    alert("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16); // Initialize map with a default view

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Foram Shah"
}).addTo(map);

const markers = {}; // Object to store markers by socket.id

socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    console.log(`Received location from ${id}: ${latitude}, ${longitude}`);
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]); // Update marker position
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Create new marker if it doesn't exist
    }
});

socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); // Remove marker when user disconnects
        delete markers[id];
    }
});


