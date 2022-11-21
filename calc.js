//Declaring all global varibles
// let perfLocation = "performanceTables/737-800W"
let perfLocation

let rwLength
let rwHdg
let rwElev
let rwSlope
let cond
let windDir
let windStrength
let OAT
let OATLdg
let QNH
let RTG
let ATM
let FLAP
let BLEED
let AntiIce
let TOW
let CG
let LAW

let hwComp
let hwCompLdg

let stopway
let clearway

let corrdRwElev
let vMbe

let mostLimWeight
let mostLimWeightField

let improvedClimbWeightAdj = []

let ARPT
let ARPTLdg

let slush = false
let depth

let lastTry
let forceFlap = false;
let forceRTG = false;
//Print varibles
let trim
let vref = []
let n1s
let vSpds
let vSpdsAssumed = [];

// ------------------EVENT-LISTNERS-------------
//TAKE OFF
document.getElementById("QNH").addEventListener("blur", calcQnh)
document.getElementById("TOW").addEventListener("blur", setWeight)
document.getElementById("airport").addEventListener("input", function() {
    if(document.getElementById("airport").value.length == 4)
    findAirport("airport")
})
document.getElementById("runway").addEventListener("change", getIntersections)
document.getElementById("windInput").addEventListener("blur", calcWind)
document.getElementById("OAT").addEventListener("blur", calcFarenheit)
document.getElementById("inputConditions").addEventListener("input", function(){
    document.getElementById("resultsWindow").style.opacity = 0;
    document.getElementById("perfModel").style.opacity = 0;
    document.getElementById("atmSwitch").style.opacity = 0;
    document.getElementById("maxTow").style.opacity = 0
})
//LANDING
document.getElementById("QNHLdg").addEventListener("blur", calcQnh)
document.getElementById("LAW").addEventListener("blur", setWeight)
document.getElementById("airportLdg").addEventListener("input", function() {
    if(document.getElementById("airportLdg").value.length == 4)
        findAirport("airportLdg")
})
document.getElementById("windInputLdg").addEventListener("blur", calcWind)
document.getElementById("OATLdg").addEventListener("blur", calcFarenheit)
document.getElementById("inputConditionsLdg").addEventListener("input", function(){
    document.getElementById("resultsWindowLadning").style.opacity = 0;
    document.getElementById("perfModelLdg").style.opacity = 0;
    document.getElementById("ldgCalcBtn").classList.remove("hidden")
    document.getElementById("rwyGraphicLdg").classList.add("hidden")
    document.getElementById("resultsWindowLadning").classList.remove("hidden")
    document.getElementById("resultsWindowLandingGUI").classList.add("hidden")
})

//--------------------UI-updates-------------------
// BOTH LANDING AND TAKEOFF
function calcQnh() {
    QNH = document.getElementById(this.id).value
    if(QNH) {
        if(QNH > 950 && QNH < 1080) {
            let inhg = Math.floor(QNH * 0.029529980164712 * 100);
            document.getElementById(this.id).placeholder = `${QNH} HPa`;
            this.parentElement.firstElementChild.firstElementChild.innerHTML = (inhg/100).toFixed(2) + " IN HG";
        } else if (QNH > 1080 || QNH < 950) {
            document.getElementById(this.id).placeholder = "OUT OF RANGE";        
            this.parentElement.firstElementChild.firstElementChild.innerHTML = " ";
        }
    }
    // if (document.getElementById(this.id).value == 0) {
    //     document.getElementById(this.id).placeholder = ""
    //     this.parentElement.firstElementChild.firstElementChild.innerHTML = " ";
    // }
    document.getElementById(this.id).value = "";
}

function calcWind() {
    let windInput = document.getElementById(this.id).value
    let windDir = windInput.split("/")[0];
    let windStrength = windInput.split("/")[1];
    let rwHdg = this.parentElement.parentElement.getElementsByTagName('div')[1].getElementsByTagName('select')[0].value.split(",")[0]
    if(!document.getElementById(this.id).value.includes("/")){
        windStrength = document.getElementById(this.id).value
        rwHdg ? windDir = rwHdg : windDir = 0
    }
    windDir = parseInt(windDir);
    windStrength = parseInt(windStrength);
    if (isNaN(windStrength)) {
    } else if(windDir > 360){
    } else {
        
        let placeholderText = `00${windDir}`.slice(-3) + `/${windStrength} KT`
        var relativeWindDir = Math.abs(rwHdg - windDir);
        var HWcomp = Math.round(Math.cos(relativeWindDir * (Math.PI / 180)) * windStrength);
        var XWcomp = Math.round(Math.sin(relativeWindDir * (Math.PI / 180)) * windStrength);
        if(HWcomp < 0) {
            this.parentElement.firstElementChild.firstElementChild.innerHTML = Math.abs(HWcomp) + " TW/" + Math.abs(XWcomp) + " XW";    
        } else {
            this.parentElement.firstElementChild.firstElementChild.innerHTML = HWcomp + " HW/" + Math.abs(XWcomp) + " XW";
        }
        document.getElementById(this.id).placeholder = placeholderText
        if(!document.getElementById(this.id).value.includes("/"))
            document.getElementById(this.id).placeholder = placeholderText.split("/")[1]
        
    }    
    // if (document.getElementById(this.id).value == 0) {
    //     document.getElementById(this.id).placeholder = ""
    //     this.parentElement.firstElementChild.firstElementChild.innerHTML = " ";
    // }
    if (windStrength === 0) {
        this.parentElement.firstElementChild.firstElementChild.innerHTML = "0 HW/0 XW";
        document.getElementById(this.id).placeholder = "0 KT"
        HWcomp = 0
    }
    document.getElementById(this.id).value = ""
    this.id == "windInputLdg" ? hwCompLdg = HWcomp : hwComp = HWcomp
}

function calcFarenheit() {
    let OATinput = document.getElementById(this.id).value
    if(OATinput) {
        if(OATinput > -40 && OATinput < 50) {
            let farenheit = Math.floor((OATinput*1.8)+32);
            this.parentElement.firstElementChild.firstElementChild.innerHTML = farenheit + " F";
            document.getElementById(this.id).placeholder = OATinput + " C";
        } else if (OAT < -40 || OAT > 50) {
            document.getElementById(this.id).placeholder = "OUT OF RANGE";     
            this.parentElement.firstElementChild.firstElementChild.innerHTML = " ";
        }
    }
    // if (document.getElementById(this.id).value == 0) {
    //     document.getElementById(this.id).placeholder = ""
    //     this.parentElement.firstElementChild.firstElementChild.innerHTML = " ";
    // }
    document.getElementById(this.id).value = "";
    this.id == "OATLdg" ? OATLdg = OATinput : OAT = OATinput
}

function setWeight() {
    let weightInput = document.getElementById(this.id).value
    if(weightInput < 80)
        weightInput = weightInput * 1000
    document.getElementById(this.id).placeholder = weightInput + " KG"
    this.id == "TOW" ? TOW = parseInt(weightInput) : LAW = parseInt(weightInput);
    document.getElementById(this.id).value = ""
    // if(weightInput == 0)
    //     document.getElementById(this.id).placeholder = "KG"
}

//TAKE OFF
function findAirport(inputBox) {
    
    if(this.id)
        inputBox = this.id
    if(!document.getElementById(inputBox).value) {
        document.getElementById(inputBox).placeholder = "ARPT SEARCH"
        return
    }
    let airportInput = document.getElementById(inputBox).value.toUpperCase();
    let lastAirport;
    let runwayBox
    inputBox == "airport" ? ARPT = airportInput : ARPTLdg = airportInput
    inputBox == "airport" ? runwayBox = "runway" : runwayBox = "runwayLdg"
    
    fetch('runwayDatabase/runways.json')
    .then(res => res.json())
    .then(json => (json.filter(airports => airports.airport_ident == airportInput)))
    .then(RWYS => {
        if (lastAirport != airportInput) {
            document.getElementById(runwayBox).innerHTML = '';
        }
        
        for (let i = 0; i < RWYS.length; i++) {
            const runway = document.createElement("option");
            runway.text = RWYS[i].runway;
            runway.value = RWYS[i].rwHdg + "," + RWYS[i].rwyLength + "," + RWYS[i].rwyElev + "," + RWYS[i].slope + "," + RWYS[i].runway;
            document.getElementById(runwayBox).add(runway)
        }
        lastAirport = airportInput;

        // Calls for intersercion function to add intersections to INTX list
        getIntersections()
        getIata(inputBox, airportInput)
        document.getElementById(inputBox).classList.remove("whitePlaceholder")
        document.getElementById(inputBox).value = ""

        //Cleans out other input fields
        //DONT TOUCH  0,4 [0-6]
        //DONT TOUCH  7 [7-6]
        let max
        let min
        if(inputBox == "airport") {
            max = 7;
            min = 1;
        } else {
            max = document.querySelectorAll("input").length
            min = 8
        }
        for (let i = min; i < max; i++) {
            if(i == 4)
                i == i++
            document.querySelectorAll("input")[i].placeholder = ""
            document.querySelectorAll("input")[i].value = ""
        }

        //Resets all dropdowns to first option
        if(inputBox == "airport") {
            max = 8;
            min = 0;
        } else {
            max = document.querySelectorAll("input").length
            min = 8
        }
        for (let i = min; i < max; i++) {
            document.querySelectorAll("select")[i].selectedIndex = "0"
        }
    })
}

function getIata(inputBox, airportInput) {
    fetch(`runwayDatabase/airports.json`)
    .then(res => res.json())
    .then(json => (json.filter(airports => airports.airport_ident == airportInput)))
    .then(airport => {
        let iata = airport[0].airport_iata
        document.getElementById(inputBox).placeholder = `${airportInput}/${iata}`
        document.getElementById(inputBox).blur()
    })
}

function getIntersections() {
    let currentRwy = document.getElementById("runway").value.split(",")[4];
    fetch('runwayDatabase/intersections.json')
    .then(res => res.json())
    .then(json => (json.filter(intersection => intersection.airport_ident == ARPT && intersection.runway == currentRwy)))
    .then(intersections => {
        document.getElementById("intx").innerHTML = ""
        const fullRwy = document.createElement("option");
        fullRwy.text = "FULL " + currentRwy
        fullRwy.value = "FULL";
        document.getElementById("intx").add(fullRwy)        

        for (let i = 0; i < intersections.length; i++) {
            const intersection = document.createElement("option");
            intersection.text = intersections[i].intersectionName;
            intersection.value = intersections[i].intersectionDist + "," + intersections[i].intersectionName;
            document.getElementById("intx").add(intersection)
            
        }
    })
}


// //_________________________________________T_E_S_T___________________________________
// hwComp = 8;
// OAT = 5;
// QNH = 999;
// TOW = 61100;
// ----------------------------------------On-submit------------------------------------------------
inputConditions.addEventListener('submit', function (event) {
    //Blurs screen and adds loading screen
    loadingProgress(5)
    document.getElementById("calculating").style.display = "flex"
    document.getElementById("takeOff").classList.add("blur")
    document.querySelector('header').classList.add("blur")
    document.querySelector('footer').classList.add("blur")
    cond = document.getElementById("cond").value;

    event.preventDefault()
    if(cond == "slush")
        cond = "DRY"
    else
        slush = false

    forceFlap = false;
    fullForced = false;
    forceRTG = false;
    lastTry = false;
    mainCalc()
});
function mainCalc() {
   document.getElementById("resultsWindow").style.opacity = 0;
   document.getElementById("perfModel").style.opacity = 0;
   document.getElementById("atmSwitch").style.opacity = 0;
   
    //    Setting all varibles
    rwLength = Math.round(document.getElementById("runway").value.split(",")[1]/3.28084);
    rwHdg = document.getElementById("runway").value.split(",")[0];
    rwElev = parseInt(document.getElementById("runway").value.split(",")[2]);
    rwSlope = document.getElementById("runway").value.split(",")[3];
    ATM = document.getElementById("ATM").value;
    BLEED = document.getElementById("BLEED").value;
    AntiIce = document.getElementById("A/ICE").value;
    CG = parseInt(document.getElementById("CG").value);
    improvedClimbWeightAdj = [0, 0, 0, 0]
    
    if(!forceFlap)
        FLAP = parseInt(document.getElementById("FLAP").value);
        if (FLAP == 0) FLAP = 1;
    if(!forceRTG)
        RTG = document.getElementById("RTG").value;

    stopway = 0;
    clearway = 0;
    getEoSid();
    getTrim();
    getVref();
    loadingProgress(13)
    mainProcessTree();
}

//---------------------------Main-functions------------------------------
async function mainProcessTree () {
    let perfLimitAssumedTemp
    if(!lastTry)
        perfLimitAssumedTemp = await PD();
    loadingProgress(20)
    if(perfLimitAssumedTemp < 707){
        console.log("found possible soluton")
        await PI(perfLimitAssumedTemp)
        print()
    } else if(perfLimitAssumedTemp > 727){
        console.log("No take off allowed")
        loadingProgress(94)
        performanceLimitedPrint()
    } else {
        console.log("Trying again with more perf")
    }
    
    
    
}

async function PD() {
    corrdRwElev = await correctQNH();
    document.getElementById("intx").value != "FULL" ? rwLength = document.getElementById("intx").value.split(",")[0]/3.28084 : console.log()//do nothing
    let clearwayStopways = await clearwayStopway()
    if(stopway > 0 || clearway > 0) {
        if (cond == "DRY")
            stopway < clearway ? rwLength = rwLength + clearway : rwLength = rwLength + stopway
        else 
            rwLength = rwLength + stopway
    }
    let corrdFieldLength = await correctFieldLength()


//------------Limiting-weights-and-speeds---------
    //Weightlimits: fullField, fullClimb, Obstacle, Tire
    //Speedlimits: VMBE
    let fullFieldLimitSL = await tableLookup(`${perfLocation}/fieldLimit_${FLAP}_${cond}_${RTG}.json`, corrdFieldLength, OAT)
    let fullFieldLimit = fullFieldLimitSL - (2.2 * (corrdRwElev/1000))
    let fullClimbLimit = await climbLimLookup(OAT)
    //Adjusts field and climb limitweight based on bleedsetting and antiice
    let acAiAdjustWeights = await bledAntiIceWeightAdjustments()
    fullFieldLimit = fullFieldLimit + acAiAdjustWeights[0]
    fullClimbLimit = fullClimbLimit + acAiAdjustWeights[1]

    let obstacleLimWeight = await obstacleLim(corrdFieldLength, OAT)    
    let tireSpdLimWeight = await tireSpdLimCalc()
    vMbe = await vMbeCalc()
    
    mostLimWeightField = Math.min(fullFieldLimit, obstacleLimWeight)
    if(slush)
        mostLimWeightField = await slipRwyCondCalc(mostLimWeightField, corrdRwElev, corrdFieldLength)

    mostLimWeightField = Math.min(mostLimWeightField, tireSpdLimWeight)
    if(!slush && document.getElementById("IMPCL").value == 1 && fullFieldLimit > fullClimbLimit) {
        improvedClimbWeightAdj = await impclCalc(fullFieldLimit, fullClimbLimit)
        fullClimbLimit = fullClimbLimit + improvedClimbWeightAdj[3]
    }
    
    let maxAssumedTemp = 717
    if(mostLimWeightField < TOW/1000 || fullClimbLimit < TOW/1000) {
        if(FLAP == 1) { //tries again with same RTG but more flaps
            FLAP = 5
            forceFlap = true;
            mainCalc()
            return
        } else if(RTG < 26) { //Gets here incase of current Flaps 5 and 22k, tries again with more higher RTG
            RTG = 26;
            FLAP = 1;
            forceRTG = true;
            mainCalc()
            return
        } else { //Take off is not possible with current weight
            maxAssumedTemp = 737
            mostLimWeight = Math.min(mostLimWeightField, fullClimbLimit)
            lastTry = true
        }
    } else {
        maxAssumedTemp = 707
    }
//----------------Calculates-assumed-temp--------------------------   
    if(!slush && maxAssumedTemp < 717)
        maxAssumedTemp = await assumedTempCalc(corrdFieldLength, acAiAdjustWeights[0], acAiAdjustWeights[1])
    else
        maxAssumedTemp = 25

    return maxAssumedTemp
}



async function PI(perfLimitAssumedTemp) {
    vSpds = await vSpeeds(perfLimitAssumedTemp)
    if(slush)
        vSpds[0] = await vSpeedSlushAdj(vSpds[0])
    
    for (let i = 0; i < 3; i++) {
        vSpds[i] = vSpds[i] + Math.round(improvedClimbWeightAdj[i])
        vSpdsAssumed[i] = Math.round(vSpdsAssumed[i] + improvedClimbWeightAdj[i])
    }
    n1s = await n1(perfLimitAssumedTemp)
}

//---------------------------One-time-use-functions---------------------------
// PD
async function correctQNH() {
    let table = await fetchTable(`${perfLocation}/QNHCorrection.json`)
    let elevCorrection = 1000;
    for (let i = 0; i < table.tableX.length; i++) {
       if(QNH > table.tableX[i])
            elevCorrection = table.col1[i+1]
    }
    return elevCorrection + rwElev
}

async function correctFieldLength() {
    let slopeCorrd = await tableLookup(`${perfLocation}/slopeCorrection.json`, rwLength, rwSlope);
    let corrdFieldLength = await tableLookup(`${perfLocation}/windCorrection.json`, slopeCorrd, hwComp);
    return corrdFieldLength;
}

//async function fieldLimitWeight(corrdFieldLength, corrdRwElev) {
    //Calculates field limit takeoff weight with no assumed temp
//let tableLocation = `performanceTables/fieldLimit_${FLAP}_${cond}_${RTG}.json`;
//let fieldLimWeightFullSeaLevel = await tableLookup(tableLocation, corrdFieldLength, OAT)
        // 2.2 is the ammount of filed limit weight you lose per 1000ft above sea level
//let fieldLimWeightFull = fieldLimWeightFullSeaLevel - (2.2 * (corrdRwElev/1000))

    // Calculates climb limit takeoff weight with no assumed temp
//let climbLimWeightFull = await climbLimLookup(OAT)

    //Adjusts field and climb limit based on bleed and antiice
//let bleedFieldAdj = 0
//let antiIceFieldAdj = 0
//let bleedClimbAdj = 0
//let antiIceClimbAdj = 0
//if(BLEED == 0) {
//    bleedFieldAdj = await fieldClimbAdj("field", 0)
//    bleedClimbAdj = await fieldClimbAdj("climb", 0)
//}
//if(AntiIce == 1){
//    antiIceFieldAdj = await fieldClimbAdj("field", 1)
//    antiIceClimbAdj = await fieldClimbAdj("climb", 1)
//}
//if(AntiIce == 2) {
//    antiIceFieldAdj = await fieldClimbAdj("field", 2)
//    antiIceClimbAdj = await fieldClimbAdj("climb", 2)
//}

//let fieldWeightAdj = bleedFieldAdj + antiIceFieldAdj
//fieldLimWeightFull = fieldLimWeightFull + fieldWeightAdj

//let climbWeightAdj = bleedClimbAdj + antiIceClimbAdj
//climbLimWeightFull = climbLimWeightFull + climbWeightAdj
//____________CHECKING_ALL_DIFFRENT_WEIGHT_LIMITS_AND_SETS_MOST_LIMITING_TO "mostLimWeight"___________________________________
    // obstacles
//let obstacleLimWeight = await obstacleLim(corrdFieldLength, OAT)
//if(fieldLimWeightFull > obstacleLimWeight) {
//    mostLimWeight = obstacleLimWeight
//    console.log("Obs limited", obstacleLimWeight)
//}
//else
//    mostLimWeight = fieldLimWeightFull

    // VMBE
//let vMbeRef = await tableLookup(`performanceTables/vMbe_26.json`, OAT, corrdRwElev) //TODO add for table 22K
//vMbe = await tableLookup(`performanceTables/vMbeAdj_26.json`, TOW/1000, vMbeRef) //TODO add for table 22K
//    // Runway slope, - is downwards
//if (rwSlope > 0)
//    vMbe = vMbe + (1 * rwSlope)
//if (rwSlope < 0)
//    vMbe = vMbe + (4 * rwSlope)
//if (hwComp > 0)   
//    vMbe = vMbe + (0.3 * hwComp)
//if (hwComp < 0)   
//    vMbe = vMbe + (1.9 * hwComp)

    //Tire speed limit
//let tireSpdLimWeight = await tableLookup(`performanceTables/tireSpdLim_5_26.json`, OAT, corrdRwElev) //TODO only flap 5 26k is added
//if (hwComp > 0)   
//tireSpdLimWeight = tireSpdLimWeight + (0.6 * hwComp) //TODO Diffrent addatives based on diffrent derates and flaps. this is for 26k and flaps 5
//if (hwComp < 0)   
//tireSpdLimWeight = tireSpdLimWeight + (1.1 * hwComp)

//if(mostLimWeight > tireSpdLimWeight){
//    mostLimWeight = tireSpdLimWeight
//    console.log("Tirespeed limted", tireSpdLimWeight)
//}
    
////Checks limits for max assumed
//let climbLimWeightAssumed = await climbLimLookup(50)
//let fieldLimWeightAssumed = await tableLookup(tableLocation, corrdFieldLength, 50);
//let obsLimWeightAssumed = await obstacleLim(corrdFieldLength, 50)
    
//calculating assumed temp
//tableLocation = `performanceTables/fieldLimit_${FLAP}_${cond}_${RTG}.json`;
//let assumedTemp = 51;
    
//if(mostLimWeight >= TOW/1000 && climbLimWeightFull >= TOW/1000){
//    while (fieldLimWeightAssumed < TOW/1000 || climbLimWeightAssumed < TOW/1000 || obsLimWeightAssumed < TOW/1000) {
//        assumedTemp--;
//        fieldLimWeightAssumed = await tableLookup(tableLocation, corrdFieldLength, assumedTemp)
//        fieldLimWeightAssumed = fieldLimWeightAssumed + fieldWeightAdj
//        climbLimWeightAssumed = await climbLimLookup(assumedTemp)
//        climbLimWeightAssumed = climbLimWeightAssumed + climbWeightAdj
//        obsLimWeightAssumed = await obstacleLim(corrdFieldLength, assumedTemp)
//        if(mostLimWeight > fieldLimWeightAssumed)
//            fieldLimWeightAssumed = mostLimWeight
//    }        
//If full thrust is not enough with current flap and derate
//  } else {
//      if(lastTry)
//          assumedTemp = 737;
//      else {
//          assumedTemp = 717;
//          // Test with more flaps
//          if(FLAP == 1) {
//              FLAP = 5;
//              forceFlap = true;
//              mainCalc()
//          } else if(RTG == 22){
//              if (FLAP == 5 && lastTry == false)
//                  FLAP = 1
//          // Test with less derate (sets derate = derate + 2) aka 22 = 22 + 2
//              RTG = 26;
//              forceRTG = true;
//              lastTry = true
//              mainCalc()
//          } else if(RTG == 26 && FLAP == 5) {
//              lastTry = true
//              assumedTemp = 737;
//          }
//      }
//  }

  //  return assumedTemp;
//}

async function obstacleLim(TORA, temp) {
    let obsList = await fetchTable("runwayDatabase/obstacles.json")
    let runway = document.getElementById("runway").value.split(",")[4];
    let activeObstecles = obsList.filter(airports => airports.airport_ident == ARPT && airports.runway == runway)    
    let obsTora = ((TORA)-26)
    let mostRestrictiveObsLimWeight = 100
    for (let i = 0; i < activeObstecles.length; i++) {
        let activeObsDist = (activeObstecles[i].obsDist/3.28084) + obsTora;
        let activeObsHeight = activeObstecles[i].obsHeight/3.28084
        if(activeObsDist < 7600) {
            let refLimWeight = await tableLookup(`${perfLocation}/obsLimWeight_${FLAP}_26.json`, activeObsHeight, activeObsDist/100)
            if(refLimWeight) {
                let refLimWeightAdj = 0
                if(temp > 29)
                    refLimWeightAdj = await tableLookup(`${perfLocation}/obsTempAdj_26.json`, temp, refLimWeight)
                refLimWeightAdj = await tableLookup(`${perfLocation}/obsAltAdj_26.json`, corrdRwElev, refLimWeightAdj)
                refLimWeightAdj = await tableLookup(`${perfLocation}/obsWindAdj_26.json`, hwComp, refLimWeightAdj)
                refLimWeight = refLimWeight + refLimWeightAdj
                if(refLimWeight < mostRestrictiveObsLimWeight)
                mostRestrictiveObsLimWeight = refLimWeight
            }
        }
    }
    return mostRestrictiveObsLimWeight;
}

async function slipRwyCondCalc(dryFieldLimit, corrdRwElev, corrdFieldLength) {
    let slAdj = await tableLookup(`${perfLocation}/weightAdj_sl_slush_${RTG}.json`, dryFieldLimit, depth)
    let fiveAdj = await tableLookup(`${perfLocation}/weightAdj_5000_slush_${RTG}.json`, dryFieldLimit, depth)
    let adjustment = ((1 - (corrdRwElev / 5000)) * slAdj) + ((corrdRwElev / 5000) * fiveAdj)
    let adjustedWeight = dryFieldLimit + adjustment

    //VMCG weigh limit
    fieldAdjFactor = (OAT - 4)/5
    adjustedFieldLength = corrdFieldLength + (fieldAdjFactor * 35)
    let slVmcg = await tableLookup(`${perfLocation}/vmcg_sl_slush_${RTG}.json`, adjustedFieldLength, depth)
    let fiveVmcg = await tableLookup(`${perfLocation}/vmcg_5000_slush_${RTG}.json`, adjustedFieldLength, depth)
    let vmcgSlip = ((1 - (corrdRwElev / 5000)) * slVmcg) + ((corrdRwElev / 5000) * fiveVmcg)
    return Math.min(adjustedWeight, vmcgSlip)
    
}

async function bledAntiIceWeightAdjustments() {
    let bleedFieldAdj = 0
    let antiIceFieldAdj = 0
    let bleedClimbAdj = 0
    let antiIceClimbAdj = 0

    if(BLEED == 0) {
        bleedFieldAdj = await fieldClimbAdj("field", 0)
        bleedClimbAdj = await fieldClimbAdj("climb", 0)
    }
    if(AntiIce == 1){
        antiIceFieldAdj = await fieldClimbAdj("field", 1)
        antiIceClimbAdj = await fieldClimbAdj("climb", 1)
    }
    if(AntiIce == 2) {
        antiIceFieldAdj = await fieldClimbAdj("field", 2)
        antiIceClimbAdj = await fieldClimbAdj("climb", 2)
    }
    let fieldAdjust = antiIceFieldAdj + bleedFieldAdj
    let climbAdjust = antiIceClimbAdj + bleedClimbAdj
    return [fieldAdjust, climbAdjust]
}

async function vMbeCalc() {
    let vMbeRef = await tableLookup(`${perfLocation}/vMbe_26.json`, OAT, corrdRwElev) //TODO add for table 22K
    vMbeRef = await tableLookup(`${perfLocation}/vMbeAdj_26.json`, TOW/1000, vMbeRef) //TODO add for table 22K

    //Runway slope - is down, + is up
    if (rwSlope > 0)
        vMbeRef = vMbeRef + (1 * rwSlope)
    if (rwSlope < 0)
        vMbeRef = vMbeRef + (4 * rwSlope)
    if (hwComp > 0)   
        vMbeRef = vMbeRef + (0.3 * hwComp)
    if (hwComp < 0)   
        vMbeRef = vMbeRef + (1.9 * hwComp)
    
    //Returns max SPEED for v1, if V1 > VMBE, decrease TOW by 550kg per knot V1 > VMBE (this is done later)
    return vMbeRef
}

async function tireSpdLimCalc() {
    let refTireSpdLimWeight = await tableLookup(`${perfLocation}/tireSpdLim_5_26.json`, OAT, corrdRwElev) //TODO only flap 5 26k is added
    if (hwComp > 0)   
        refTireSpdLimWeight = refTireSpdLimWeight + (0.6 * hwComp) //TODO Diffrent addatives based on diffrent derates and flaps. this is for 26k and flaps 5
    if (hwComp < 0)   
        refTireSpdLimWeight = refTireSpdLimWeight + (1.1 * hwComp)
    
    return refTireSpdLimWeight
}

async function assumedTempCalc(corrdFieldLength, fieldWeightAdj, climbWeightAdj) {
    let assumedFieldLimit = await tableLookup(`${perfLocation}/fieldLimit_${FLAP}_${cond}_22.json`, corrdFieldLength, 50);
    let assumedClimbLimit = await climbLimLookup(50)
    let assumedObsLimit = await obstacleLim(corrdFieldLength, 50)

    let assumedTemp = 51;
    while (assumedFieldLimit < TOW/1000 || assumedClimbLimit < TOW/1000 || assumedObsLimit < TOW/1000 || assumedTemp < 25) {
        assumedTemp--;
        assumedFieldLimit = await tableLookup(`${perfLocation}/fieldLimit_${FLAP}_${cond}_${RTG}.json`, corrdFieldLength, assumedTemp)
        assumedFieldLimit = assumedFieldLimit + fieldWeightAdj
        assumedClimbLimit = await climbLimLookup(assumedTemp)
        assumedClimbLimit = assumedClimbLimit + climbWeightAdj
        assumedObsLimit = await obstacleLim(corrdFieldLength, assumedTemp)

        if (document.getElementById("IMPCL").value == 1 && assumedFieldLimit > assumedClimbLimit) {
            improvedClimbWeightAdj = await impclCalc(assumedFieldLimit, assumedClimbLimit)
            assumedClimbLimit = assumedClimbLimit + improvedClimbWeightAdj[3]
        }
    } 

    return assumedTemp
}

async function impclCalc(fieldLim, climbLim) {
    let fieldClimbDelta = fieldLim - climbLim
    let climbImpTable = await fetchTable(`${perfLocation}/impCl_${FLAP}_${cond}_${RTG}.json`)
    let xValues = find2Nearest(climbImpTable.tableY, fieldClimbDelta)    
    let yValues = find2Nearest(climbImpTable.tableX, climbLim)
    let yLow = "col" + (yValues[0] + 1)
    let yHigh = "col" + (yValues[1] + 1)
    let xLow = (xValues[0])
    let xHigh = (xValues[1])
    
    let high
    let low
    let yWeight = yValues[2]
    let xWeight = xValues[2]
    let lowWeightedAvrage
    let highWeightedAvrage
    let adjustments = []

    for (let i = 0; i < 4; i++) {
        low = climbImpTable[yLow][xLow].split(" ")[i]
        high = climbImpTable[yLow][xHigh].split(" ")[i]
        lowWeightedAvrage = ((1 - yWeight) * low) + (yWeight * high)

        low = climbImpTable[yHigh][xLow].split(" ")[i]
        high = climbImpTable[yHigh][xHigh].split(" ")[i]
        highWeightedAvrage = ((1 - yWeight) * low) + (yWeight * high)

        adjustments[i] = ((1 - xWeight) * lowWeightedAvrage) + (xWeight * highWeightedAvrage)
    }
    return adjustments
}


// PI
async function vSpeeds(assumedTemp) {
    loadingProgress(57)
    let tableLocation = (`${perfLocation}/vSpds_${cond}_${RTG}.json`)
    //x = Flap setting, Y = TOW
    let vSpdTable = await fetchTable(tableLocation)
    let towAvrage = find2Nearest(vSpdTable.tableY, TOW/1000)
    
    let flapIndex = vSpdTable.tableX.indexOf(FLAP)
    let flapTableSetting = "col" + (flapIndex + 1);

    // Calculating avrage v1 speeds based on weight
    let lowSpds = vSpdTable[flapTableSetting][towAvrage[0]]
    let highSpds = vSpdTable[flapTableSetting][towAvrage[1]]
    let refVspeeds = []
    for (let i = 0; i < 3; i++) {
        let lowSpd = lowSpds.split(" ")[i]
        let highSpd = highSpds.split(" ")[i]
        let spd = (lowSpd * (1 - towAvrage[2])) + (highSpd * towAvrage[2])        
        refVspeeds[i] = spd
    }
    
    // Correction vSpeeds based on conditions
    let vSpeedAdjustments = []
    let vSpeedAdjustmentsAssumed = [];
    let vNames = ["v1", "vr", "v2"]
    for (let i = 0; i < 3; i++) {
        let currentVspd = vNames[i]
        vSpeedAdjustments[i] = await tableLookup(`${perfLocation}/${currentVspd}Adj_${cond}_${RTG}.json`, OAT, corrdRwElev/1000)
        vSpeedAdjustmentsAssumed[i] = await tableLookup(`${perfLocation}/${currentVspd}Adj_${cond}_${RTG}.json`, assumedTemp, corrdRwElev/1000)
    }
    let v1SlopeAdj = await tableLookup(`${perfLocation}/v1SlopeAdj_${cond}_${RTG}.json`, TOW/1000, rwSlope)
    let v1WindAdj = await tableLookup(`${perfLocation}/v1WindAdj_${cond}_${RTG}.json`, TOW/1000, hwComp)       //avrage weighted the wrong way SOMEtimes with tailwind...
    let v1clearwayStopwayAdj = await tableLookup(`${perfLocation}/v1ClearwayStopwayAdj_${cond}_${RTG}.json`, refVspeeds[0], clearway - stopway)
    vSpeedAdjustments[0] = vSpeedAdjustments[0] + (v1SlopeAdj + v1WindAdj + v1clearwayStopwayAdj)
    let vSpds = []
    //Adjusts all vSpeeds
    for (let i = 0; i < refVspeeds.length; i++) {
        vSpds[i] = Math.round(refVspeeds[i] + vSpeedAdjustments[i])
        vSpdsAssumed[i] = Math.round(refVspeeds[i] + vSpeedAdjustmentsAssumed[i])
    }
    //checks VMBE
    if(vSpds[0] > vMbe)
        alert(`Exceeding maximum brake energy limit. Decrease your weight by ${Math.floor(vSpds[0] - vMbe)*500}KG.`)
    //Checks v1 MCG
    let vMcg = await tableLookup(`${perfLocation}/vMcg_${cond}_${RTG}.json`, OAT, corrdRwElev)
    if(vSpds[0] < vMcg)
        vSpds[0] = vMcg


    return vSpds
}

async function clearwayStopway() {
    let runway = document.getElementById("runway").value.split(",")[4];

    let clearStopwayList = await fetchTable("runwayDatabase/clearStopways.json")
    let runwayStats = clearStopwayList.filter(airports => airports.airport_ident == ARPT && airports.runway == runway)
    if (runwayStats[0]) {
        stopway = runwayStats[0].stopway/3.28084
        clearway = runwayStats[0].clearway/3.28084
        
        // sets clearway and checks that we dont use more then allowed clearway for runway length
        let maxClearwayTable = await fetchTable(`${perfLocation}/maxClearway.json`)
        let maxClearway = find2Nearest(maxClearwayTable.tableX, rwLength)
        let maxUsebleClearway = ((maxClearwayTable.col1[maxClearway[0]]) * (1 - maxClearway[2])) + (maxClearwayTable.col1[maxClearway[1]] * maxClearway[2])    
        clearway > maxUsebleClearway ? clearway = maxUsebleClearway : console.log("Within limits")
    }
}

async function n1(perfLimitAssumedTemp) {
    loadingProgress(79)
    //1. OAT, corrdRwElev
    //Retruns max allowed assumed, compare this with perfLimitAssumed and set the lowest to actAssumedTemp
    let maxRegulatedAssumedTemp = await tableLookup(`${perfLocation}/maxAssumed_${RTG}.json`, OAT, corrdRwElev)
    perfLimitAssumedTemp < maxRegulatedAssumedTemp ? assumedTemp = perfLimitAssumedTemp : assumedTemp = Math.floor(maxRegulatedAssumedTemp)
    
    //2. actAssumedTemp/OAT, corrdRwElev
    //look up n1% for actAssumedTemp
    //also check n1% for OAT and set to global varible for max n1% incase of full thrust
    let assumedN1 = false
    if (assumedTemp > 30)
        assumedN1 = await tableLookup(`${perfLocation}/n1_${RTG}.json`, assumedTemp, corrdRwElev)
    let fullN1 = await tableLookup(`${perfLocation}/n1_${RTG}.json`, OAT, corrdRwElev)

    //3. actAssumedTemp - OAT, OAT
    //subtract result from max n1% with assumed temp and set this ass actual N1% for take off with assumed temp
    if (assumedTemp > 30) {
        let assumedN1Adj = await tableLookup(`${perfLocation}/n1AdjAssumed_${RTG}.json`, assumedTemp - OAT, OAT)
        assumedN1 = assumedN1 - assumedN1Adj
        assumedN1 = Math.round(assumedN1 * 10) / 10
    }
    fullN1 = Math.round(fullN1 * 10) / 10
    if(BLEED == 0)
        fullN1 = fullN1 - 0.7
    if(!assumedN1)
        assumedN1 = 20
    return [fullN1, assumedN1, assumedTemp]
}

async function getTrim() {
    let trimTableLocation
    FLAP < 6 ? trimTableLocation = `${perfLocation}/stabTrim_${RTG}_1n5.json` : trimTableLocation = `${perfLocation}/stabTrim_${RTG}_10n15n25.json`
    trim = await tableLookup(trimTableLocation, TOW/1000, CG)
}

async function getVref(intention) {
    let weight;
    intention == "ldg" ? weight = (LAW / 1000) : weight = (TOW/1000);
    table = await fetchTable(`${perfLocation}/vref40.json`)
    let vrefs = find2Nearest(table.tableX, weight)
    for (let i = 1; i < 3; i++) {
        let currentVref = ((table[`col${i}`][vrefs[0]]) * (1 - vrefs[2])) + (table[`col${i}`][vrefs[1]] * vrefs[2])
        vref[i] = Math.round(currentVref); //TODO check if Math.round is better then Math.ceil that was before
    }
    return vref;
}

async function getEoSid() {
    let currentRwy = document.getElementById("runway").value.split(",")[4];

    fetch('runwayDatabase/EoSid.json')
    .then(res => res.json())
    .then(json => (json.filter(eoSids => eoSids.airport_ident == ARPT && eoSids.runway == currentRwy)))
    .then(eoSid => {
        if (eoSid[0]) 
            document.getElementById("eoSid").innerHTML = "Engine Failure Procedure:   " + eoSid[0].eoSid
        else
        document.getElementById("eoSid").innerHTML = "Engine Failure Procedure:   " + `At 25 NM enter HLDG (${rwHdg} INBD,RT)`
    })
}

async function vSpeedSlushAdj(v1) {
    let slAdj = await tableLookup(`${perfLocation}/v1Adj_sl_slush_${RTG}.json`, TOW/1000, depth)
    let fiveAdj = await tableLookup(`${perfLocation}/v1Adj_5000_slush_${RTG}.json`, TOW/1000, depth)
    let adjustment = ((1 - (corrdRwElev / 5000)) * slAdj) + ((corrdRwElev / 5000) * fiveAdj)
    v1 = Math.round(v1 + adjustment)
    return v1
}

// Print
function print() {
    loadingProgress(92)
    fullForced = false;
    let id = element => document.getElementById(element)
    id("flapResult").innerHTML = FLAP
    let rwyResult;
    if(id("intx").value != "FULL") {
        id("rwyTitle").innerHTML = "RWY / INTX"
        rwyResult = id("runway").value.split(",")[4] + "/" + id("intx").value.split(",")[1]
    } else {
        id("rwyTitle").innerHTML = "RWY"
        rwyResult = id("runway").value.split(",")[4]
    }
    id("rwyResult").innerHTML = rwyResult;
    id("togwResult").innerHTML = TOW + "KG"

    RTG == 22 ? id("derateResultTitle").innerHTML = "D-TO-2" : id("derateResultTitle").innerHTML = "D-TO"
    if(BLEED == 0) {
        if(RTG == 22)
            id("derateResultN1").innerHTML = (n1s[1]-0.9).toFixed(1)
        else
            id("derateResultN1").innerHTML = (n1s[1]-1).toFixed(1)
    } else 
        id("derateResultN1").innerHTML = n1s[1].toFixed(1)
    
    if(trim)
        id("trimResult").innerHTML = (Math.round(trim*100)/100).toFixed(2)
    else
    id("trimResult").innerHTML = "N/A"
    id("tempResult").innerHTML = n1s[2] + "<span> C</span>"

    id("vref40Result").innerHTML = vref[1]

    id("resultsWindow").style.opacity = 1;
    id("perfModel").style.opacity = 1;
    id("atmSwitch").style.opacity = 1;
    document.getElementById("tempResult").parentElement.style.opacity = 1;
    if (assumedTemp < 31) {
        forceFull()
        id("v1Result").innerHTML = vSpds[0]
        id("vrResult").innerHTML = vSpds[1]
        id("v2Result").innerHTML = vSpds[2]
    } else {
        id("v1Result").innerHTML = vSpdsAssumed[0]
        id("vrResult").innerHTML = vSpdsAssumed[1]
        id("v2Result").innerHTML = vSpdsAssumed[2]
        id("atmButton").classList.add("atmActive")
        id("fullButton").classList.remove("atmActive")
        id("atmText").innerHTML = "ATM"
    }
    
    document.getElementById("calculating").style.display = "none"
    document.getElementById("takeOff").classList.remove("blur")
    document.querySelector('header').classList.remove("blur")
    document.querySelector('footer').classList.remove("blur")
}

function performanceLimitedPrint() {
    document.getElementById("takeOff").classList.remove("blur");
    document.querySelector('header').classList.remove("blur");
    document.querySelector('footer').classList.remove("blur");
    document.getElementById("calculating").style.display = "none"
    document.getElementById("maxTow").style.opacity = 1
    let RTOW = Math.floor(mostLimWeight*1000)
    document.getElementById("maxTow").innerHTML = `No takeoff allowed. Planned weight exceeds max allowable weight of ${RTOW} KG.`
}

function cancelCalc() {
    document.getElementById("calculating").style.display = "none"
    document.getElementById("takeOff").classList.remove("blur")
    document.querySelector('header').classList.remove("blur")
    document.querySelector('footer').classList.remove("blur")
    throw new Error("Calculation has been canceld");

}

//---------------------------Utility-functions---------------------------
async function climbLimLookup(temp) {
    table = await fetchTable(`${perfLocation}/climbLimit_${FLAP}_${RTG}.json`)
    let climbLimNear = find2Nearest(table.tableX, temp)
    let climbLimWeight = ((table.col1[climbLimNear[0]]) * (1 - climbLimNear[2])) + (table.col1[climbLimNear[1]] * climbLimNear[2])
    return climbLimWeight;
}

async function fetchTable(tableLocation) {
    let res = await fetch(tableLocation)
    let json = await res.json()
    return json;
}

async function tableLookup(tableLocation, inputY, inputX) {

    let res = await fetch(tableLocation)
    let json = await res.json()    
    
    let xValues = find2Nearest(json.tableY, inputY)    
    let yValues = find2Nearest(json.tableX, inputX)

    // X is what col and Y is pos in that col
    let yLow = "col" + (yValues[0] + 1)
    let yHigh = "col" + (yValues[1] + 1)

    //Final weighted avrage from the 4 values into one interpolated value
    let weightedXLow = ((1 - xValues[2]) * json[yLow][xValues[0]]) + (json[yLow][xValues[1]] * xValues[2])
    let weightedXHigh = ((1 - xValues[2]) * json[yHigh][xValues[0]]) + (json[yHigh][xValues[1]] * xValues[2])
    let result = ((1 - yValues[2]) * weightedXLow) + (yValues[2] * weightedXHigh);
    return result;
}

function find2Nearest(array, inputNumber) {
    const closest = array.reduce((prev, curr) => {
        if (curr != null) {
        return (Math.abs(curr - inputNumber) < Math.abs(prev - inputNumber) ? curr : prev)
        } else {
            return prev
        }
        
    })
    let index = array.indexOf(closest) 
    let before
    let after    
    
    let deltaBefore
    let deltaAfter 
   
    // If value on the end of table i inputed
    if (index == 0) {
        before = null;
        after = array[index + 1]
        deltaAfter = Math.abs((inputNumber - after)) / Math.abs((after - closest))
        return [index, index + 1, deltaAfter]
    } else {
        before = array[index - 1]
    }
    
    if (index == array.length - 1 || !array[index + 1]) {
        after = null;
        deltaBefore = Math.abs((inputNumber - before)) / Math.abs((before - closest))
        return [index - 1, index, deltaBefore]
    } else {
        after = array[index + 1]
    }    

    deltaBefore = Math.abs((inputNumber - before)) / Math.abs((before - closest))
    deltaAfter = Math.abs((inputNumber - after)) / Math.abs((after - closest))

    if (inputNumber < closest) {
        if(inputNumber > before) {
            return [index - 1, index, deltaBefore]
        } else {
            return [index + 1, index, deltaAfter]
        }
    }
    if(inputNumber > closest) {
        if(inputNumber < before) {
            return [index, index - 1, 1 - deltaBefore]
        } else if(inputNumber > before){
            return [index, index + 1, 1 - deltaAfter]
        } else {
            console.log("U DONE FUCKED UP")
        }
    }
    if(inputNumber == closest) {
        return[index, index, 1]
    }
}

async function fieldClimbAdj(title, modifier) {
    let table
    let thrustSetting = "k" + RTG
    let flapSetting = "f" + FLAP

    table = await fetchTable(`modifiers/${title}LimAdj_${cond}.json`)

    return table[thrustSetting][flapSetting][modifier]/1000
}



// ________________________Ladning_calculation__________________________________
async function ldgCalc() {
    //Shows loading screen
    document.getElementById("calculating").style.display = "flex"
    document.getElementById("takeOff").classList.add("blur")
    document.querySelector('header').classList.add("blur")
    document.querySelector('footer').classList.add("blur")
    //collect all input conditions

    let rwElevLdg = parseInt(document.getElementById("runwayLdg").value.split(",")[2]);
    let rwSlopeLdg = document.getElementById("runwayLdg").value.split(",")[3];
    let runwayLdg = document.getElementById("runwayLdg").value.split(",")[4];
    let condLdg = document.getElementById("condLdg").value;
    let QNHLdg = document.getElementById("QNHLdg").value;
    let BLEEDLdg = document.getElementById("BLEEDLdg").value;
    let AntiIceLdg = document.getElementById("A/ICELdg").value;
    // let BRKS = document.getElementById("BRKS").value;
    let REV = document.getElementById("REV").value;
    let flapLdg = document.getElementById("flapLdg").value;
    let vrefAdd = parseInt(document.getElementById("vrefAdd").value);
    if(!vrefAdd)
        vrefAdd = 0;
    let vrefs = await getVref("ldg")
    flapLdg == 40 ? ldgVref = vrefs[1] : ldgVref = vrefs[2]
    let REVADJ;
    let landingDistances= []
    let landDistTable = await fetchTable(`${perfLocation}/landDist_${flapLdg}.json`)

    let landAdjTable = landDistTable.filter(airports => airports.COND == condLdg)
    for (let i = 0; i < landAdjTable.length; i++) {
        let refDist = landAdjTable[i].DIST
        let wtAdj = landAdjTable[i].WT
        let altAdj = landAdjTable[i].ALT
        let ldgWindAdj = landAdjTable[i].WIND
        let slopeAdj = landAdjTable[i].SLOPE
        let tempAdj = landAdjTable[i].TEMP
        let appSpdAdj = landAdjTable[i].SPD
        let revAdj = landAdjTable[i].REV + "," + landAdjTable[i].FULLREV

        if(REV == 0)
            REVADJ = revAdj.split(",")[1]
        else if(REV == 1)
            REVADJ = revAdj.split(",")[0]
        else
            REVADJ = 0

        let lawDelta = (LAW - 65000)/5000
        let wtAdjustedDist = ldgTableLookup(refDist, wtAdj, lawDelta)
        let altAdjustedDist = ldgTableLookup(wtAdjustedDist, altAdj, rwElevLdg/1000)
        let windAdjustedDist = ldgTableLookup(altAdjustedDist, ldgWindAdj, hwCompLdg/10)
        let slopeAdjustedDist = ldgTableLookup(windAdjustedDist, slopeAdj, rwSlopeLdg)
        let tempAdjustedDist = ldgTableLookup(slopeAdjustedDist, tempAdj, (OATLdg - 15)/10)
        let appSpdAdjustedDist = ldgTableLookup(tempAdjustedDist, appSpdAdj + "/" + appSpdAdj, vrefAdd/5)
        let landingDist = ldgTableLookup(appSpdAdjustedDist, REVADJ + "/" + REVADJ, 1)
        landingDistances[i] = landingDist
    }

    // ______________PRINT_________________
    printLdg(landingDistances)
 
    function printLdg(landingDistances) {

        for (let i = 1; i < 6; i++) {
            document.querySelector(`#ladningDistances :nth-child(${i})`).style.color = "rgb(254, 254, 254)"
            document.querySelector(`#ladningDistancesTitles :nth-child(${i})`).style.color = "rgb(254, 254, 254)"
            document.getElementsByClassName("title")[i-1].style.color = "rgb(254, 254, 254)"
            document.querySelector(`#ldgRunway :nth-child(${i+4})`).firstElementChild.nextElementSibling.style.borderColor = "#25BF7F"
        } 
        //ADDS ALL VALUES
        let id = element => document.getElementById(element)
        id("ldgResultTitle").firstElementChild.innerHTML = `Enroute Landing Data for <span>${LAW} KG:</span>`
        let vrefDisplay
        flapLdg == 30 ? vrefDisplay = vrefs[2] + vrefAdd : vrefDisplay = vrefs[1] + vrefAdd
        id("ldgResultTitle").firstElementChild.nextElementSibling.innerHTML = `Vref${flapLdg}+${vrefAdd}:        <span>${vrefDisplay}</span> KT`
        //Sets all distances
        let lda = Math.round(id("runwayLdg").value.split(",")[1]/3.28084) //FIX
        let os = [1, 5, 4, 3, 2];
        for (let i = 0; i < 5; i++) {
            o = os[i]
            document.querySelector(`#ladningDistances :nth-child(${i+1})`).innerHTML = `${Math.floor(landingDistances[o-1])} <span>M</span>`
        }
        

        for (let i = 1; i < 6; i++) {
            let current = document.querySelector(`#ladningDistances :nth-child(${i})`)
            if (current.innerHTML.split(" ")[0] > lda) {
                current.style.color = "#B3912F"
                document.querySelector(`#ladningDistancesTitles :nth-child(${i})`).style.color = "#B3912F"
            }
        }   
        id("lda").innerHTML = `<h1>Ladning Distance Available:     <span>${lda}</span> M</h1>`;

        // GUI
        id("enrLdgDataGUI").innerHTML = `
        <h1>Enroute Landing Data for ${runwayLdg}:</h1>
        <h2>Vref${flapLdg}+${vrefAdd} <span>${ldgVref + vrefAdd} </span>KT</h2>`
        id("ldaGUI").innerHTML = `LDA: ${lda} M`
        //LDG distances text
        document.getElementById("grdLineEnd").style.backgroundColor = "#25BF7F"
        for (let i = 0; i < 5; i++) {
            document.getElementsByClassName("title")[i].firstElementChild.nextElementSibling.innerHTML = Math.round(landingDistances[i]) + " M"
            if(landingDistances[i] > lda) {
                document.getElementsByClassName("title")[i].style.color = "#B3912F"
                document.querySelector(`#ldgRunway :nth-child(${i+5})`).firstElementChild.nextElementSibling.style.borderColor = "#B3912F"
                document.getElementById("grdLineEnd").style.backgroundColor = "#BF8D10"
            }
            let leftMargin = ((landingDistances[i]/lda)*500)+43
            let adMarginLeft = ((455/lda)*500)+43
            let grdLength = (((landingDistances[4]/lda)*500)+45)-adMarginLeft
            let appMarginLeft = ((455/lda)*500)-89
            document.getElementById("grdLine").style.width = grdLength + "px"
            document.querySelector(`#ldgRunway :nth-child(${i + 5})`).style.marginLeft = leftMargin + "px"
            document.getElementById("AD").style.marginLeft = adMarginLeft + "px"
            document.getElementById("grdLine").style.marginLeft = adMarginLeft + "px"
            document.getElementById("appLine").style.marginLeft = appMarginLeft + "px"            
            let colorBrake = (546 - adMarginLeft) + "px"
            document.getElementById("grdLine").style.background = `linear-gradient(to right,#25BF7F ${colorBrake}, #BF8D10 ${colorBrake})`
        }

        //DISPLAYS RESULT WINDOW
        id("resultsWindowLadning").style.opacity = 1;
        id("perfModelContainerLdg").style.opacity = 1;
        document.getElementById("perfModelLdg").style.opacity = 1;
        document.getElementById("calculating").style.display = "none"
        document.getElementById("takeOff").classList.remove("blur")
        document.querySelector('header').classList.remove("blur")
        document.querySelector('footer').classList.remove("blur")
        document.getElementById("rwyGraphicLdgBtn").firstElementChild.classList.remove("slideRight")
        document.getElementById("rwyGraphicLdgBtn").style.backgroundColor = "rgb(36, 37, 46)"
        //Hides button and shows rwy grapichs button
        document.getElementById("ldgCalcBtn").classList.toggle("hidden")
        document.getElementById("rwyGraphicLdg").classList.toggle("hidden")
    }
}

function ldgTableLookup(input, factor, adjust){
    adjust > 0 ? factor = factor.split("/")[0] : factor = factor.split("/")[1]
    return input + (factor * adjust)
}