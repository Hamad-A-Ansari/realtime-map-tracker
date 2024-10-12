const socket = io(); //sends connection request to app/backend server.

if(navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const {latitude, longitude} = position.coords; //get latitude and longitude
    socket.emit("send-location", {latitude, longitude}); //sends coordinates to app/backend server
  }, (error) => {
    console.error(error);
  },
  {
    enableHighAccuracy: true, //enable high accuracy
    timeout: 5000, // change interval
    maximumAge: 0, //no cache data
    
  }
  );
}

const map = L.map("map").setView([0,0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
  attribution: "Hamad Ahmad Ansari - Realtime Tracker"
}).addTo(map);

const markers = {};

socket.on("receive-location", (data)=> {
  const {id, latitude, longitude} = data;
  map.setView([latitude, longitude]);
  if(markers[id]){
    markers[id].setLatLng([latitude, longitude]);
  }
  else{
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected", ()=> {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});