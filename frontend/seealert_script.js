
const open = document.getElementById("open")
const close = document.getElementById("close")
const navbtn = document.getElementById("nav-btn")
const navmenu = document.getElementById("hamburger")

const navbar = document.getElementById("navbar")
const nonNav = document.getElementById("non-nav")

let isopen = true;

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