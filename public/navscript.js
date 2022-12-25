const open = document.getElementById("open")
const close = document.getElementById("close")
const navbtn = document.getElementById("nav-btn")
const navmenu = document.getElementById("hamburger")
const sosbtn = document.getElementById("alertButton")
const alertTxt = document.getElementById("btn-txt-alert")
const helptxt = document.getElementById("help-txt")
const lottie = document.getElementById("gif")
const navbar = document.getElementById("navbar")
const nonNav = document.getElementById("non-nav")

let isopen = true;
let isRaised = false;
let alertRaised = false;

close.classList.add("hidden")
navmenu.classList.add("hidden")
window.addEventListener('load',()=>{
    nonNav.style.minHeight=`${window.innerHeight-navbar.clientHeight}px`
})

navbtn.addEventListener("click", ()=>{
    if(isopen){
        isopen=false;
        open.classList.add("hidden")
        close.classList.remove("hidden")
        navmenu.classList.remove("hidden")
    }else{
        isopen=true;
        close.classList.add("hidden")
        open.classList.remove("hidden")
        navmenu.classList.add("hidden")
    }
})

sosbtn.addEventListener('click', ()=>{
    console.log("bullied")
    if(isRaised){
        alertstop()
        alertTxt.innerHTML="SOS"
        lottie.style.visibility="hidden"
        helptxt.innerText = "Are you getting bullied?"
    }else{
        raisealert()
        lottie.style.visibility="unset"
        alertTxt.innerHTML="STOP"
        helptxt.innerText = "Alert sent to all your friends."
    }
    isRaised=!isRaised
})

function raisealert(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(async (position) => {
            let latitude=position.coords.latitude;
            let longitude=position.coords.longitude;
            const res = await fetch('/alert' ,{
                method: 'POST',
                cache: 'no-cache',
                mode:'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                referrerPolicy: 'no-referrer',
                body: JSON.stringify({latitude: latitude, longitude: longitude})
            })
            console.log(res.json())
        })
    }else{
        alert("Geolocation not available")
    }
}
async function alertstop(){
    let res= await fetch('/close-alert', {
        method: 'POST'
    })
    console.log(res)
}