let fullForced

document.getElementById("atmButton").addEventListener("click", setActive)
document.getElementById("fullButton").addEventListener("click", setActive)

function setActive() {
    if (fullForced == true) 
        return

    let activeMode = this.id.split("B")[0].toUpperCase()

    document.getElementsByClassName("atmSelect")[0].classList.remove("atmActive")
    document.getElementsByClassName("atmSelect")[1].classList.remove("atmActive")
    this.classList.add("atmActive")
    
    document.getElementById("atmText").innerHTML = activeMode


    if (activeMode == "FULL") {
        document.getElementById("tempResult").parentElement.style.opacity = 0
        document.getElementById("derateResultN1").innerHTML = n1s[0]
        document.getElementById("derateResultTitle").innerHTML = document.getElementById("derateResultTitle").innerHTML.split("-")[1]
    } else {
        document.getElementById("tempResult").parentElement.style.opacity = 1
        document.getElementById("derateResultN1").innerHTML = n1s[1]
        document.getElementById("derateResultTitle").innerHTML = "D-" + document.getElementById("derateResultTitle").innerHTML
    }
}
function forceFull() {
    fullForced = true;
    document.getElementById("atmText").innerHTML = "FULL"
    document.getElementById("tempResult").parentElement.style.opacity = 0;
    document.getElementsByClassName("atmSelect")[0].classList.add("atmActive")
    document.getElementsByClassName("atmSelect")[1].classList.remove("atmActive")
    document.getElementById("derateResultTitle").innerHTML = document.getElementById("derateResultTitle").innerHTML.split("-")[1]
    document.getElementById("derateResultN1").innerHTML = n1s[0];
}




// -------------------Drop-down-menus--------------------------
// let elements = document.getElementsByClassName("dropDownWindow")
// Array.from(elements).forEach(function(element) {
//     element.addEventListener('click', menuClick);
// });


// //Opens and closes menu when pressing it
// function menuClick() {
//     let dropDownItem = this.nextElementSibling;
//     let displayStatus = window.getComputedStyle(dropDownItem).getPropertyValue('display');
//     displayStatus == "none" ? (dropDownItem).classList.remove("closed") : (dropDownItem).classList.add("closed");
// }

// //on mouseclick sett all to closed exept "event" this one.

// window.onclick = function (event) {

//     // console.log(event.target)
//     // console.log(event.target.nextElementSibling)
//     let dropDowns = document.getElementsByClassName("dropDownOptions")
//     console.log(event.target.nextElementSibling.classList[0])
//     // if(!event.target.nextElementSibling.includes("closed")){
//     //     console.log("sad")
//     // }
//     for (let i = 0; i < dropDowns.length; i++) {
//         // (dropDowns[i]).classList.add("closed")
//     }
// }