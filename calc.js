//Declaring all global varibles
let rwLength
let rwHdg
let rwElev
let rwSlope
let cond
let windDir
let windStrength
let OAT
let QNH
let RTG
let ATM
let FLAP
let BLEED
let AntiIce
let TOW
let CG

let hwComp

let stopway
let clearway

let corrdRwElev
let vMbe

let forceFlap = false;
let forceRTG = false;
//Print varibles
let trim
let vref40
let n1s
let vSpds

//--------------------UI-updates-------------------
document.getElementById("airport").addEventListener("blur", findAirport)
function findAirport() {
    let airportInput = document.getElementById("airport").value.toUpperCase();
    let lastAirport;

    fetch('runwayDatabase/runways.json')
    .then(res => res.json())
    .then(json => (json.filter(airports => airports.airport_ident == airportInput)))
    .then(RWYS => {
        if (lastAirport != airportInput) {
            document.getElementById("runway").innerHTML = '';
        }
        
        for (let i = 0; i < RWYS.length; i++) {
            const runway = document.createElement("option");
            runway.text = RWYS[i].runway;
            runway.value = RWYS[i].rwHdg + "," + RWYS[i].rwyLength + "," + RWYS[i].rwyElev + "," + RWYS[i].slope + "," + RWYS[i].runway;
            document.getElementById("runway").add(runway)
        }
        lastAirport = airportInput;

        // Calls for intersercion function to add intersections to INTX list
        getIntersections()

    })
}
document.getElementById("runway").addEventListener("change", getIntersections)
function getIntersections() {
    let airportId = document.getElementById("airport").value.toUpperCase();
    let currentRwy = document.getElementById("runway").value.split(",")[4];
    fetch('runwayDatabase/intersections.json')
    .then(res => res.json())
    .then(json => (json.filter(intersection => intersection.airport_ident == airportId && intersection.runway == currentRwy)))
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
document.getElementById("windInput").addEventListener("blur", calcWind)
function calcWind() {
    let windInput = document.getElementById("windInput").value
    let windDir = windInput.split("/")[0];
    let windStrength = windInput.split("/")[1];
    let rwHdg = document.getElementById("runway").value.split(",")[0];
    

    windDir = parseInt(windDir);
    windStrength = parseInt(windStrength);
    if (isNaN(windStrength)) {
        
    } else if(windDir > 360){
        
    } else {
        var relativeWindDir = Math.abs(rwHdg - windDir);
        var HWcomp = Math.floor(Math.cos(relativeWindDir * (Math.PI / 180)) * windStrength);
        var XWcomp = Math.floor(Math.sin(relativeWindDir * (Math.PI / 180)) * windStrength);
        if(HWcomp < 0) {
            document.getElementById("windComponentDisplay").innerHTML = Math.abs(HWcomp) + " TW/" + XWcomp + " XW";    
        } else {
            document.getElementById("windComponentDisplay").innerHTML = HWcomp + " HW/" + XWcomp + " XW";
        }
        return HWcomp;
    }    
}
document.getElementById("OAT").addEventListener("blur", calcFarenheit)
function calcFarenheit() {
    let OAT = document.getElementById("OAT").value
    if(OAT) {
        if(OAT > -40 && OAT < 50) {
            let farenheit = Math.floor((OAT*1.8)+32);
            document.getElementById("oatDisplay").innerHTML = farenheit + " F";
        } else if (OAT < -40 || OAT > 50) {
            document.getElementById("OAT").placeholder = "OUT OF RANGE";        
            document.getElementById("OAT").value = "";
            document.getElementById("oatDisplay").innerHTML = " ";
        }
      }
}
document.getElementById("QNH").addEventListener("blur", calcQnh)
function calcQnh() {
    let QNH = document.getElementById("QNH").value
    if(QNH) {
        if(QNH > 950 && QNH < 1080) {
        let inhg = Math.floor(QNH * 0.029529980164712 * 100);
        document.getElementById("qnhDisplay").innerHTML = inhg/100 + " IN HG";
        } else if (QNH > 1080 || QNH < 950) {
        document.getElementById("QNH").placeholder = "OUT OF RANGE";        
        document.getElementById("QNH").value = "";
        document.getElementById("qnhDisplay").innerHTML = " ";
        }
    }
}
document.getElementById("inputConditions").addEventListener("input", function(){
    document.getElementById("resultsWindow").style.opacity = 0;
    document.getElementById("perfModel").style.opacity = 0;
    document.getElementById("atmSwitch").style.opacity = 0;
})

// ----------------------------------------On-submit------------------------------------------------
inputConditions.addEventListener('submit', function (event) {
   event.preventDefault()
   forceFlap = false;
   forceRTG = false;
   fullForced = false;
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
    cond = document.getElementById("cond").value;
    windDir = document.getElementById("windInput").value.split("/")[0];
    windStrength = document.getElementById("windInput").value.split("/")[1];
    OAT = parseInt(document.getElementById("OAT").value);
    QNH = document.getElementById("QNH").value;
    ATM = document.getElementById("ATM").value;
    BLEED = document.getElementById("BLEED").value;
    AntiIce = document.getElementById("A/ICE").value;
    TOW = parseInt(document.getElementById("TOW").value)/1000;
    CG = parseInt(document.getElementById("CG").value);
    
    
    if(!forceFlap)
        FLAP = parseInt(document.getElementById("FLAP").value);
        if (FLAP == 0) FLAP = 1;
    if(!forceRTG)
        RTG = document.getElementById("RTG").value;

    hwComp = calcWind()

    stopway = 0;
    clearway = 0;

    getEoSid();
    getTrim();
    getVref();
    mainProcessTree();
}


//---------------------------Main-functions------------------------------
async function mainProcessTree () {
    let perfLimitAssumedTemp = await PD();
    if(perfLimitAssumedTemp < 717){
        await PI(perfLimitAssumedTemp)
        print()
    } else if(perfLimitAssumedTemp > 727){
        performanceLimitedPrint()
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
    let maxAssumedTempField = await fieldLimitWeight(corrdFieldLength, corrdRwElev) //returns  [maxAssumedTempField, choosenDerate, flapSetting]
    return maxAssumedTempField;
}
async function PI(perfLimitAssumedTemp) {
    vSpds = await vSpeeds()
    n1s = await n1(perfLimitAssumedTemp)
}



//---------------------------One-time-use-functions---------------------------
// PD
async function correctQNH() {
    let table = await fetchTable("performanceTables/QNHCorrection.json")
    let elevCorrection = 1000;
    for (let i = 0; i < table.tableX.length; i++) {
        QNH > table.tableX[i] ? elevCorrection = table.col1[i+1] : console.log() ;
    }
    return elevCorrection + rwElev
}
async function correctFieldLength() {
    let slopeCorrd = await tableLookup("performanceTables/slopeCorrection.json", rwLength, rwSlope);
    let corrdFieldLength = await tableLookup("performanceTables/windCorrection.json", slopeCorrd, hwComp);
    return corrdFieldLength;
}
async function fieldLimitWeight(corrdFieldLength, corrdRwElev) {
    //Calculates field limit takeoff weight with no assumed temp
    let tableLocation = `performanceTables/fieldLimit_${FLAP}_${cond}_${RTG}.json`;
    let fieldLimWeightFullSeaLevel = await tableLookup(tableLocation, corrdFieldLength, OAT)
        // 2.2 is the ammount of filed limit weight you lose per 1000ft above sea level
    let fieldLimWeightFull = fieldLimWeightFullSeaLevel - (2.2 * (corrdRwElev/1000))

    // Calculates climb limit takeoff weight with no assumed temp
    let climbLimWeightFull = await climbLimLookup(OAT)

    //Adjusts field and climb limit based on bleed and antiice
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

    let fieldWeightAdj = bleedFieldAdj + antiIceFieldAdj
    fieldLimWeightFull = fieldLimWeightFull + fieldWeightAdj

    let climbWeightAdj = bleedClimbAdj + antiIceClimbAdj
    climbLimWeightFull = climbLimWeightFull + climbWeightAdj
//____________CHECKING_ALL_DIFFRENT_WEIGHT_LIMITS_AND_SETS_MOST_LIMITING_TO "mostLimWeight"___________________________________
    let mostLimWeight
    // obstacles
    let obstacleLimWeight = await obstacleLim()
    if(fieldLimWeightFull > obstacleLimWeight) 
        mostLimWeight = obstacleLimWeight
    else
        mostLimWeight = fieldLimWeightFull

    // VMBE
    let vMbeRef = await tableLookup(`performanceTables/vMbe_26.json`, OAT, corrdRwElev) //TODO add for table 22K
    vMbe = await tableLookup(`performanceTables/vMbeAdj_26.json`, TOW, vMbeRef) //TODO add for table 22K
        // Runway slope, - is downwards
    if (rwSlope > 0)
        vMbe = vMbe + (1 * rwSlope)
    if (rwSlope < 0)
        vMbe = vMbe + (4 * rwSlope)
    if (hwComp > 0)   
        vMbe = vMbe + (0.3 * hwComp)
    if (hwComp < 0)   
        vMbe = vMbe + (1.9 * hwComp)

    //Tire speed limit
    let tireSpdLimWeight = await tableLookup(`performanceTables/tireSpdLim_5_26.json`, OAT, corrdRwElev) //TODO only flap 5 26k is added
    if (hwComp > 0)   
    tireSpdLimWeight = tireSpdLimWeight + (0.6 * hwComp) //TODO Diffrent addatives based on diffrent derates and flaps. this is for 26k and flaps 5
    if (hwComp < 0)   
    tireSpdLimWeight = tireSpdLimWeight + (1.1 * hwComp)

    if(mostLimWeight < tireSpdLimWeight)
        mostLimWeight = tireSpdLimWeight
    
    //Checks limits for max assumed
    let climbLimWeightAssumed = await climbLimLookup(50)
    let fieldLimWeightAssumed = await tableLookup(tableLocation, corrdFieldLength, 50);
    
//calculating assumed temp
    tableLocation = `performanceTables/fieldLimit_${FLAP}_${cond}_${RTG}.json`;
    let assumedTemp = 50;
    let lastTry = false
    if(mostLimWeight >= TOW && climbLimWeightFull >= TOW ){
        while (fieldLimWeightAssumed < TOW || climbLimWeightAssumed < TOW) {
            fieldLimWeightAssumed = await tableLookup(tableLocation, corrdFieldLength, assumedTemp)
            fieldLimWeightAssumed = fieldLimWeightAssumed + fieldWeightAdj
            climbLimWeightAssumed = await climbLimLookup(assumedTemp)
            climbLimWeightAssumed = climbLimWeightAssumed + climbWeightAdj
            if(mostLimWeight > fieldLimWeightAssumed)
                fieldLimWeightAssumed = mostLimWeight
            assumedTemp--;
        }        
//If full thrust is not enough with current flap and derate
    } else {
        if(lastTry)
            assumedTemp = 737;
        else 
            assumedTemp = 717;
        
        // Test with more flaps
        if(FLAP == 1) {
            FLAP = 5;
            forceFlap = true;
            mainCalc()
        } else if(RTG == 22){
            if (FLAP == 5 && lastTry == false)
                FLAP = 1
        // Test with less derate (sets derate = derate + 2) aka 22 = 22 + 2
            RTG = 26;
            forceRTG = true;
            lastTry = true
            mainCalc()
        }
    }

    return assumedTemp;
}
//Obstacle calculation
async function obstacleLim() {
    let obsList = await fetchTable("runwayDatabase/obstacles.json")
    let airport = document.getElementById("airport").value.toUpperCase();
    let runway = document.getElementById("runway").value.split(",")[4];
    let activeObstecles = obsList.filter(airports => airports.airport_ident == airport && airports.runway == runway)    
    let obsTora = ((document.getElementById("runway").value.split(",")[1]/3.28084)-26)
    let mostRestrictiveObsLimWeight = 100
    for (let i = 0; i < activeObstecles.length; i++) {
        let activeObsDist = (activeObstecles[i].obsDist/3.28084) + obsTora;
        let activeObsHeight = activeObstecles[i].obsHeight/3.28084
        if(activeObsDist < 7600) {
            let refLimWeight = await tableLookup(`performanceTables/obsLimWeight_${FLAP}_26.json`, activeObsHeight, activeObsDist/100)
            if(refLimWeight) {
                let refLimWeightAdj = 0
                if(OAT > 29)
                    refLimWeightAdj = await tableLookup(`performanceTables/obsTempAdj_26.json`, OAT, refLimWeight)
                refLimWeightAdj = await tableLookup(`performanceTables/obsAltAdj_26.json`, corrdRwElev, refLimWeightAdj)
                refLimWeightAdj = await tableLookup(`performanceTables/obsWindAdj_26.json`, hwComp, refLimWeightAdj)
                refLimWeight = refLimWeight + refLimWeightAdj
                if(refLimWeight < mostRestrictiveObsLimWeight)
                mostRestrictiveObsLimWeight = refLimWeight
            }
        }
    }
    return mostRestrictiveObsLimWeight;

}

// PI
async function vSpeeds() {
    let tableLocation = (`performanceTables/vSpds_${cond}_${RTG}.json`)
    //x = Flap setting, Y = TOW
    let vSpdTable = await fetchTable(tableLocation)
    let towAvrage = find2Nearest(vSpdTable.tableY, TOW)
    
    let flapIndex = vSpdTable.tableX.indexOf(FLAP)
    let flapTableSetting = "col" + (flapIndex + 1);

    // console.log(vSpdTable[flapTableSetting][towAvrage[0]])
    // console.log(vSpdTable[flapTableSetting][towAvrage[1]])
    // console.log(towAvrage[2])

    
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
    let vNames = ["v1", "vr", "v2"]

    for (let i = 0; i < 3; i++) {
        let currentVspd = vNames[i]
        vSpeedAdjustments[i] = await tableLookup(`performanceTables/${currentVspd}Adj_${cond}_${RTG}.json`, OAT, corrdRwElev/1000)
    }
    let v1SlopeAdj = await tableLookup(`performanceTables/v1SlopeAdj_${cond}_${RTG}.json`, TOW, rwSlope)
    let v1WindAdj = await tableLookup(`performanceTables/v1WindAdj_${cond}_${RTG}.json`, TOW, hwComp)       //avrage weighted the wrong way SOMEtimes with tailwind...
    let v1clearwayStopwayAdj = await tableLookup(`performanceTables/v1ClearwayStopwayAdj_${cond}_${RTG}.json`, refVspeeds[0], clearway - stopway)
    vSpeedAdjustments[0] = vSpeedAdjustments[0] + (v1SlopeAdj + v1WindAdj + v1clearwayStopwayAdj)
    let vSpds = []
    //Adjusts all vSpeeds
    for (let i = 0; i < refVspeeds.length; i++) {
        vSpds[i] = Math.round(refVspeeds[i] + vSpeedAdjustments[i])
    }
    //checks VMBE
    if(vSpds[0] > vMbe)
        alert(`Exceeding maximum brake energy limit. Decrease your weight by ${Math.floor(vSpds[0] - vMbe)*500}KG.`)
    //Checks v1 MCG
    let vMcg = await tableLookup(`performanceTables/vMcg_${cond}_${RTG}.json`, OAT, corrdRwElev)
    if(vSpds[0] < vMcg)
        vSpds[0] = vMcg


    return vSpds
}
async function clearwayStopway() {
// ________________Move to clearwayStopwatAdj funtion__________________
    //let clearwayAdjTable = await fetchTable(clearwayAdjTableLocation)    clearwayAdjTableLocation is the input argument for the new function
    //console.log(clearwayAdjTable)
//_____________________________________________________________________

    let airport = document.getElementById("airport").value.toUpperCase();
    let runway = document.getElementById("runway").value.split(",")[4];

    let clearStopwayList = await fetchTable("runwayDatabase/clearStopways.json")
    let runwayStats = clearStopwayList.filter(airports => airports.airport_ident == airport && airports.runway == runway)
    if (runwayStats[0]) {
        stopway = runwayStats[0].stopway/3.28084
        clearway = runwayStats[0].clearway/3.28084
        
        // sets clearway and checks that we dont use more then allowed clearway for runway length
        let maxClearwayTable = await fetchTable("performanceTables/maxClearway.json")
        let maxClearway = find2Nearest(maxClearwayTable.tableX, rwLength)
        let maxUsebleClearway = ((maxClearwayTable.col1[maxClearway[0]]) * (1 - maxClearway[2])) + (maxClearwayTable.col1[maxClearway[1]] * maxClearway[2])    
        clearway > maxUsebleClearway ? clearway = maxUsebleClearway : console.log("Within limits")
    }
    //FIELD LENGTH (M)              1200 1600 2000 2400 2800 3200
    //MAX ALLOWABLE CLEARWAY (M)     150  180  210  240  270  290
}
async function n1(perfLimitAssumedTemp) {
    //1. OAT, corrdRwElev
    //Retruns max allowed assumed, compare this with perfLimitAssumed and set the lowest to actAssumedTemp
    let maxRegulatedAssumedTemp = await tableLookup(`performanceTables/maxAssumed_${RTG}.json`, OAT, corrdRwElev)
    perfLimitAssumedTemp < maxRegulatedAssumedTemp ? assumedTemp = perfLimitAssumedTemp : assumedTemp = Math.floor(maxRegulatedAssumedTemp)

    //2. actAssumedTemp/OAT, corrdRwElev
    //look up n1% for actAssumedTemp
    //also check n1% for OAT and set to global varible for max n1% incase of full thrust
    let assumedN1 = false
    if (assumedTemp > 30)
        assumedN1 = await tableLookup(`performanceTables/n1_${RTG}.json`, assumedTemp, corrdRwElev)
    let fullN1 = await tableLookup(`performanceTables/n1_${RTG}.json`, OAT, corrdRwElev)

    //3. actAssumedTemp - OAT, OAT
    //subtract result from max n1% with assumed temp and set this ass actual N1% for take off with assumed temp
    if (assumedTemp > 30) {
        let assumedN1Adj = await tableLookup(`performanceTables/n1AdjAssumed_${RTG}.json`, assumedTemp - OAT, OAT)
        assumedN1 = assumedN1 - assumedN1Adj
        assumedN1 = Math.round(assumedN1 * 10) / 10
    }
    fullN1 = Math.round(fullN1 * 10) / 10
    if(BLEED == 0)
        fullN1 = fullN1 - 0.7
    return [fullN1, assumedN1, assumedTemp]
}
async function getTrim() {
    let trimTableLocation
    FLAP < 6 ? trimTableLocation = `performanceTables/stabTrim_${RTG}_1n5.json` : trimTableLocation = `performanceTables/stabTrim_${RTG}_10n15n25.json`
    trim = await tableLookup(trimTableLocation, TOW, CG)
}
async function getVref() {
    table = await fetchTable("performanceTables/vref40.json")
    let vrefs = find2Nearest(table.tableX, TOW)
    let vref = ((table.col1[vrefs[0]]) * (1 - vrefs[2])) + (table.col1[vrefs[1]] * vrefs[2])
    vref40 = Math.ceil(vref);
}
async function getEoSid() {
    let airportId = document.getElementById("airport").value.toUpperCase();
    let currentRwy = document.getElementById("runway").value.split(",")[4];

    fetch('runwayDatabase/EoSid.json')
    .then(res => res.json())
    .then(json => (json.filter(eoSids => eoSids.airport_ident == airportId && eoSids.runway == currentRwy)))
    .then(eoSid => {
        if (eoSid[0]) 
            document.getElementById("eoSid").innerHTML = "Engine Failure Procedure:   " + eoSid[0].eoSid
        else
        document.getElementById("eoSid").innerHTML = "Engine Failure Procedure:   " + `At 25 NM enter HLDG (${rwHdg} INBD,RT)`
    })
}
// Print
function print() {
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
    id("togwResult").innerHTML = TOW*1000 + "KG"

    RTG == 22 ? id("derateResultTitle").innerHTML = "D-TO-2" : id("derateResultTitle").innerHTML = "D-TO"
    BLEED == 0 ? id("derateResultN1").innerHTML = (n1s[1]-1) : id("derateResultN1").innerHTML = n1s[1]
    

    id("trimResult").innerHTML = Math.round(trim*100)/100
    id("tempResult").innerHTML = n1s[2] + "<span> C</span>"

    id("v1Result").innerHTML = vSpds[0]
    id("vrResult").innerHTML = vSpds[1]
    id("v2Result").innerHTML = vSpds[2]

    id("vref40Result").innerHTML = vref40

    id("resultsWindow").style.opacity = 1;
    id("perfModel").style.opacity = 1;
    id("atmSwitch").style.opacity = 1;
    if (assumedTemp < 31) {
        forceFull()
    }
    
}
function performanceLimitedPrint() {
    alert("No takeoff allowed. Planned weight exceeds max allowable weight.")
}
//---------------------------Utility-functions---------------------------
async function climbLimLookup(temp) {
    table = await fetchTable(`performanceTables/climbLimit_${FLAP}_${RTG}.json`)
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
    
    // console.log(inputY, inputX)

    let xValues = find2Nearest(json.tableY, inputY)    
    let yValues = find2Nearest(json.tableX, inputX)

    // X is what col and Y is pos in that col
    let yLow = "col" + (yValues[0] + 1)
    let yHigh = "col" + (yValues[1] + 1)

    //Final weighted avrage from the 4 values into one interpolated value
    let weightedXLow = ((1 - xValues[2]) * json[yLow][xValues[0]]) + (json[yLow][xValues[1]] * xValues[2])
    let weightedXHigh = ((1 - xValues[2]) * json[yHigh][xValues[0]]) + (json[yHigh][xValues[1]] * xValues[2])
    let result = ((1 - yValues[2]) * weightedXLow) + (yValues[2] * weightedXHigh);
    // console.log(json[yLow][xValues[0]-1], json[yHigh][xValues[0]-1])
    // console.log(json[yLow][xValues[1]-1], json[yHigh][xValues[1]-1])
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


    // console.log("____________________________________________")
    // console.log("Input:", inputNumber)
    // console.log("before:", before)
    // console.log("closest:", closest)
    // console.log("after:", after)
    // console.log("____________________________________________")
    
    // if (inputNumber < 1380 && 1300 < inputNumber) {
    //     console.log("________________")
    //     console.log(inputNumber)
    //     console.log(closest)
    //     console.log(index)
    //     console.log("________________")
    // }
    
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