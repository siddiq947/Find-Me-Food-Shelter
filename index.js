const url="https://homeless-shelters-and-foodbanks-api.p.rapidapi.com/resources";
let map;
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': API_CONFIG.RAPIDAPI_KEY,
        'x-rapidapi-host': API_CONFIG.RAPIDAPI_HOST
    }
};
// Initialize the map
function initializeMap(lat = 39.8283, lng = -98.5795, zoom = 4) {
    if (map) {
      map.remove(); // Clear existing map instance
    }
    map = L.map("map").setView([lat, lng], zoom);
  
    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
  }
  
  // Add markers to the map
  function addMarkers(data) {
    data.forEach((item) => {
      if (item.latitude && item.longitude) {
        L.marker([item.latitude, item.longitude])
          .addTo(map)
          .bindPopup(`
            <b>${item.name}</b><br>
            ${item.description}<br>
            <a href="${item.website}" target="_blank">Website</a>
          `);
      }
    });
  }
document.getElementById("searchForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    if(!city || !state){
        alert("Please enter city and state");
        return;
    }


    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "<p>Loading...</p>";

    try{ 

        const updateUrl = `${url}?city=${city}&state=${state}`;
        const response = await fetch(updateUrl, options);
        if(!response.ok){
            throw new Error(`accessing data was unsuccessful. code error ${response.status}`);
        }
        const data = await response.json();
        dataFunc(data);
        initializeMap(); // Reset map to default view 
        addMarkers(data); // Add markers for the search results
    }catch{
       resultDiv.innerHTML = `<p>error ${response.messege}</p>`;
    }
})
function dataFunc(data){
    const resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";
    if(data.length === 0){
        resultDiv.innerHTML = "No Result Found!!!";
        return;
    }
    data.forEach(item => {

        const resultItem = document.createElement("div");
        resultItem.className = "result-item";
        resultItem.innerHTML = `
<h3>${item.name || "N/A"}</h3>

 <p><strong>Type:</strong> ${item.type || "N/A"}</p>

    <p><strong>Description:</strong> ${item.description || "N/A"}</p>

    <p><strong>Details URL:</strong> <a href="${item.details_url || "#"}" target="_blank">${item.details_url || "N/A"}</a></p>

    <p><strong>Full Address:</strong> ${item.full_address || "N/A"}</p>

    <p><strong>Phone Number:</strong> ${item.phone_number || "N/A"}</p>

    <p><strong>Website:</strong> <a href="${item.website || "#"}" target="_blank">${item.website || "N/A"}</a></p>

    <p><strong>Business Hours:</strong> ${item.business_hours || "N/A"}</p>

    <p><strong>Distance:</strong> ${item.distance ? `${item.distance.toFixed(2)} miles` : "N/A"}</p>
`;
        resultDiv.appendChild(resultItem);
    });

}
initializeMap();