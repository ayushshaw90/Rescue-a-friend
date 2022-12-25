const open = document.getElementById("open")
const close = document.getElementById("close")
const navbtn = document.getElementById("nav-btn")
const navmenu = document.getElementById("hamburger")

const navbar = document.getElementById("navbar")
const nonNav = document.getElementById("non-nav")

let dataAttr = document.getElementById("alertloc")
let latitudeF = dataAttr.getAttribute("latitude")
let longitudeF = dataAttr.getAttribute("longitude")

let isopen = true;

close.classList.add("hidden")
navmenu.classList.add("hidden")
window.addEventListener('load', () => {
    nonNav.style.minHeight = `${window.innerHeight - navbar.clientHeight}px`

})
navbtn.addEventListener("click", () => {
    console.log("clicked")
    if (isopen) {
        isopen = false;
        open.classList.add("hidden")
        close.classList.remove("hidden")
        navmenu.classList.remove("hidden")
    } else {
        isopen = true;
        close.classList.add("hidden")
        open.classList.remove("hidden")
        navmenu.classList.add("hidden")
    }
})

var map = L.map("map");
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
map.setView([19.5, 80], 17);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 13,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

navigator.geolocation.watchPosition(success, error);

let m, c, poly;
function success(pos) {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const accuracy = pos.coords.accuracy;

    m = L.marker([lat, lng]).addTo(map);
    c = L.circle([lat, lng], { radius: accuracy }).addTo(map);
    poly = L.marker([latitudeF * 1, longitudeF * 1]).addTo(map);
    poly._icon.classList.add("huechanger");
    m.bindPopup("<b>You are here</b>").openPopup();
    poly.bindPopup("<b>I am in danger</b><br/>I need help").openPopup();
    // if(!zoomed)
    // zoomed=map.fitBounds(c.getBounds());
    nonNav.style.minHeight = `${window.innerHeight - navbar.clientHeight}px`


}
function error(err) {
    if (err.code == 1) {
        alert("Please allow geolocation to access");
    }
    else {
        alert("cannot get current location");
    }
}
