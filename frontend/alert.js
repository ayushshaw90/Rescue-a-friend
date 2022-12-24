var map = L.map("map");
    map.setView([51.505, -0.09], 13);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    navigator.geolocation.watchPosition(success,error);

    let m ,c,poly ;
    function success(pos){
        const lat=pos.coords.latitude;
        const lng=pos.coords.longitude;
        const accuracy=pos.coords.accuracy;
        
        m=L.marker([lat,lng]).addTo(map); 
        c=L.circle([lat,lng],{radius :accuracy}).addTo(map);
        poly = L.polygon([[51.509, -0.08],[51.503, -0.06],[51.51, -0.047]],{
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
        }).addTo(map);
        
        m.bindPopup("<b>You are here</b>").openPopup();
        poly.bindPopup("<b>I am in danger</b><br/>I need help").openPopup();
        if(!zoomed)
        zoomed=map.fitBounds(c.getBounds());
        
    }
    function error(err){
        if(err.code ==1){
            alert("Please allow geolocation to access");
        }
        else{
            alert("cannot get current location");
        }
    }
