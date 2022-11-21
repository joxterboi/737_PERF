let fullForced

document.getElementById("atmButton").addEventListener("click", setActive)
document.getElementById("fullButton").addEventListener("click", setActive)


function resetAllWindows() {
    for (let i = 0; i < document.querySelectorAll("input").length; i++) {
        document.querySelectorAll("input")[i].placeholder = ""
        document.querySelectorAll("input")[i].value = ""   
    }
    for (let i = 0; i < document.querySelectorAll("select").length; i++) {
        document.querySelectorAll("select")[i].selectedIndex = "0"
    }
    for (let i = 0; i < document.getElementsByClassName("smallUnderText").length; i++) {
        document.getElementsByClassName("smallUnderText")[i].innerHTML = " "
    }
    for (let i = 0; i < document.getElementsByClassName("footerButton").length; i++) {
        document.getElementsByClassName("footerButton")[i].classList.remove("footerActive")
    }
    for (let i = 0; i < document.getElementsByClassName("page").length; i++) {
        document.getElementsByClassName("page")[i].classList.add("hidden")
    }
    document.getElementById("airport").placeholder = "ARPT SEARCH"
    document.getElementById("airport").classList.add("whitePlaceholder")
    document.getElementById("airportLdg").placeholder = "ARPT SEARCH"
    document.getElementById("airportLdg").classList.add("whitePlaceholder")
    document.getElementById("runway").innerHTML = ""
    document.getElementById("runwayLdg").innerHTML = ""
    document.getElementById("intx").innerHTML = ""
    document.getElementById("ATM").placeholder = "MAX"
    document.getElementById("TOW").placeholder = "KG"
    document.getElementById("LAW").placeholder = "KG"
    document.getElementById("vrefAdd").value = "5"

    document.getElementById("takeOff").classList.remove("hidden")
    document.getElementById("takeOffPage").classList.add("footerActive")
    document.querySelector('header').firstElementChild.firstElementChild.nextElementSibling.innerHTML = `PERFORMANCE - TAKEOFF`
    document.getElementById("hamburgerPopup").classList.add("hidden")

    document.getElementById("resultsWindow").style.opacity = 0
    document.getElementById("perfModel").style.opacity = 0;
    document.getElementById("atmSwitch").style.opacity = 0;
    document.getElementById("maxTow").style.opacity = 0
    document.getElementById("resultsWindowLadning").style.opacity = 0;
    document.getElementById("perfModelLdg").style.opacity = 0;
    document.getElementById("ldgCalcBtn").classList.remove("hidden")
    document.getElementById("rwyGraphicLdg").classList.add("hidden")
    document.getElementById("resultsWindowLadning").classList.remove("hidden")
    document.getElementById("resultsWindowLandingGUI").classList.add("hidden")
}

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
        document.getElementById("derateResultTitle").innerHTML = document.getElementById("derateResultTitle").innerHTML.slice(2)
        document.getElementById("v1Result").innerHTML = vSpds[0]
        document.getElementById("vrResult").innerHTML = vSpds[1]
        document.getElementById("v2Result").innerHTML = vSpds[2]

    } else {
        document.getElementById("tempResult").parentElement.style.opacity = 1
        document.getElementById("derateResultN1").innerHTML = n1s[1]
        if(Array.from(document.getElementById("derateResultTitle").innerHTML)[0] != "D")
            document.getElementById("derateResultTitle").innerHTML = "D-" + document.getElementById("derateResultTitle").innerHTML
        document.getElementById("v1Result").innerHTML = vSpdsAssumed[0]
        document.getElementById("vrResult").innerHTML = vSpdsAssumed[1]
        document.getElementById("v2Result").innerHTML = vSpdsAssumed[2]
    }
}
function forceFull() {
    fullForced = true;
    document.getElementById("atmText").innerHTML = "FULL"
    document.getElementById("tempResult").parentElement.style.opacity = 0;
    document.getElementsByClassName("atmSelect")[0].classList.add("atmActive")
    document.getElementsByClassName("atmSelect")[1].classList.remove("atmActive")
    document.getElementById("derateResultTitle").innerHTML = document.getElementById("derateResultTitle").innerHTML.split("D-")[1]
    document.getElementById("derateResultN1").innerHTML = n1s[0];
}

//Sets loading progress
function loadingProgress(progress) {
    document.getElementById("loadingBar").firstElementChild.innerHTML = `Calculating... ${progress}%`
    document.getElementById("blueLine").style.background = `linear-gradient(to right,#34A9FE ${progress}%, #316093 ${progress}%)`
}


//Highlights current page
let footerButtons = document.getElementsByClassName("footerButton")
Array.from(footerButtons).forEach(function(footerButton) {
    footerButton.addEventListener('click', changePage);
});
function changePage() {
    Array.from(footerButtons).forEach(function(footerButton) {
        footerButton.classList.remove("footerActive")
        document.getElementById(footerButton.id.slice(0, -4)).classList.add("hidden")
    });
    this.classList.add("footerActive")
    displayPage(this.id.slice(0, -4))
}

//Changes content when pressing footer button
function displayPage(selectedPage) {
    document.querySelector('header').firstElementChild.firstElementChild.nextElementSibling.innerHTML = `PERFORMANCE - ${selectedPage.toUpperCase()}`
    document.getElementById(selectedPage).classList.remove("hidden")
}

//Rwy graphics button switch landning
document.getElementById("rwyGraphicLdgBtn").addEventListener("click", function() {
    this.firstElementChild.classList.toggle("slideRight");
    this.classList.toggle("slideRightBackground");
    this.style.backgroundColor == "rgb(36, 37, 46)" ? this.style.backgroundColor = "rgb(14, 208, 119)" : this.style.backgroundColor = "rgb(36, 37, 46)"
    document.getElementById("resultsWindowLadning").classList.toggle("hidden");
    document.getElementById("resultsWindowLandingGUI").classList.toggle("hidden");
})

//Runway condition popup
document.getElementById("cond").addEventListener("input", openPopup)
document.getElementById("depth").addEventListener("input", function() {
    if(this.value > 0)
        document.getElementById("rwyCondPopupDone").disabled = false;
    else 
        document.getElementById("rwyCondPopupDone").disabled = true;
})
function closePopup(popup) {
    document.getElementById(popup).classList.add("hidden")
    document.getElementById("depth").value = ""
    document.getElementById("cond").selectedIndex = "0"
}
function openPopup() {
    if(this.value == "slush") {
        document.getElementById("rwyCondPopup").classList.remove("hidden")
    }
}
function setRunwayConditionTakeoff() {
    depth = document.getElementById("depth").value
    document.getElementById("rwyCondPopup").classList.add("hidden")
    slush = true;
}

// Hamburger popup
function hamburgerMenuePopup() {
    document.getElementById("hamburgerPopup").classList.toggle("hidden")
}

//Aircraft selection
function selectAircraft(aircraftType) {
    document.getElementById("profilePopup").classList.add("hidden")
    perfLocation = "performanceTables/" + aircraftType
    document.getElementById("profileBanner").firstElementChild.nextElementSibling.innerHTML = aircraftType
    console.log(perfLocation)
}
function selectAircraftPage() {
    document.getElementById("profilePopup").classList.remove("hidden")
    resetAllWindows()
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