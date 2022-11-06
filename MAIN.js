var inputConditions = document.getElementById("inputConditions");


//Declaring varibles needed before calculation
var airportInput = document.getElementById("airport").value.toUpperCase();
// const rwHdg = document.getElementById("runway").value.split(",")[0];
var windDir = document.getElementById("windInput").value.split("/")[0]; //string
var windStrength = document.getElementById("windInput").value.split("/")[1]; //string
var lastAirport = "none";
let database;




// Updates rwy list when body i clicked
document.body.addEventListener("click", lookForRwy)
function lookForRwy() {
    airportInput = document.getElementById("airport").value.toUpperCase();
    var windDir = document.getElementById("windInput").value.split("/")[0]; //string
    var windStrength = document.getElementById("windInput").value.split("/")[1]; //string
    var rwHdg = document.getElementById("runway").value.split(",")[0];
    let OAT = document.getElementById("OAT").value;
    let QNH = document.getElementById("QNH").value;
    getAllTheData(airportInput)
    windComp(rwHdg, windDir, windStrength);
    farenheitConvertion(OAT)
    qnh2inhg(QNH)
}



//-------------------------Activates on submit (pressing calc button)-----------------------------------------
inputConditions.addEventListener('submit', function(event){
    event.preventDefault()

    //Declaring varibles needed for calculation
    
    let rwLengt = Math.round(document.getElementById("runway").value.split(",")[1]/3.28084);
    let rwHdg = document.getElementById("runway").value.split(",")[0];
    let rwElev = document.getElementById("runway").value.split(",")[2];
    let cond = document.getElementById("cond").value;
    let windDir = document.getElementById("windInput").value.split("/")[0]; //string
    let windStrength = document.getElementById("windInput").value.split("/")[1]; //string
    let OAT = document.getElementById("OAT").value;
    let QNH = document.getElementById("QNH").value;
    let RTG = document.getElementById("RTG").value; // 26, 24, 22
    let ATM = document.getElementById("ATM").value; // 1 = assumed temp, 0 = full
    let FLAP = parseInt(document.getElementById("FLAP").value); // 1, 5, 10, 15, 25
    let BLEED = document.getElementById("BLEED").value; // 1 = bleed on, 0 = bleed off
    let AntiIce = document.getElementById("A/ICE").value; 
    let TOW = document.getElementById("TOW").value;
    

    CALC(airportInput,
        rwLengt,
        rwHdg,
        rwElev,
        cond,
        windDir,
        windStrength,
        OAT,
        QNH,
        RTG,
        ATM,
        FLAP,
        BLEED,
        AntiIce,
        TOW);

});

// ------------------------ MAIN CALCULATION FUNCTION --------------------------
function CALC(airportInput,
    rwLengt,
    rwHdg,
    rwElev,
    cond,
    windDir,
    windStrength,
    OAT,
    QNH,
    RTG,
    ATM,
    FLAP,
    BLEED,
    AntiIce,
    TOW) {
        // console.log(    "Airport: " + airportInput)
        // console.log(    "rwHdg: " +  rwHdg)
        // console.log(    "rwLengt: " + rwLengt)
        // console.log(    "cond: " +  cond)
        // console.log(    "windDir: "+ windDir)
        // console.log(    "windStrength: " + windStrength)
        // console.log(    "OAT: " + OAT)
        // console.log(    "QNH: " + QNH)
        // console.log(    "RTG: " + RTG)
        // console.log(    "ATM: " + ATM)
        // console.log(    "FLAP: " +  FLAP)
        // console.log(    "BLEED: " +  BLEED)
        // console.log(    "Anti Ice: " + AntiIce)
        // console.log(    "Takeoff weight: " + TOW)

    let HWcomp = windComp(rwHdg, windDir, windStrength);
        


 



    // database = "performanceDatabase/738W/field&climbLimitDryFlap5.json";
    // database = "performanceDatabase/738W/tireSpeedLimitWeightFlap5.json";
    // database = "performanceDatabase/738W/windCorrectionsDRY.json";
    dataPath ="performanceDatabase/738W/"

    // tableLookup(database, OAT, rwLengt)
    // .then(data => console.log(data))

    // tableLookup(database, HWcomp, rwLengt)
    // .then(corrFieldLength => {
    //     console.log("Corrected field length: " + corrFieldLength);
    //     return tableLookup("performanceDatabase/738W/field&climbLimitDryFlap5.json", OAT, corrFieldLength)        
    // })
    // .then(data => {
    //     console.log("Field & Climb limit weight: " + data);
    //     return tableLookup("performanceDatabase/738W/tireSpeedLimitWeightFlap5.json", rwElev, OAT)
    // }) 
    // .then(data => {
    //     let tireSpeedLimitWeight
    //     if(HWcomp > 0) {
    //          tireSpeedLimitWeight = data + (0.6*HWcomp);
    //     } else if(HWcomp < 0) {            
    //         tireSpeedLimitWeight = data + (1.1*HWcomp)
    //     }
    //     console.log("Tire speed limit weight: " + tireSpeedLimitWeight);
    // }) 


    //Take off speeds
    getTakeoffSpeeds("performanceDatabase/738W/takeoffSpeedsDry26k.json", TOW, FLAP)
    .then(vSpeeds => {
        console.log(vSpeeds[0])
        tableLookup(dataPath + "v1AdjustmentDRY26k" + ".json", rwElev/1000, OAT)
        .then(v1Adjusted => {
            console.log(v1Adjusted)
        })
        tableLookup(dataPath + "vrAdjustmentDRY26k" + ".json", rwElev/1000, OAT)
        tableLookup(dataPath + "v2AdjustmentDRY26k" + ".json", rwElev/1000, OAT)

    })









    document.getElementById("resultsWindow").style.display = "flex";
    document.getElementById("togwResult").innerHTML = TOW + " KG";
}

// -------------------------Calculates and displays small text-------------------------
// WIND COMPONTENT
function windComp(rwHdg, windDir, windStrength) {
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
// TEMPERATURE
function farenheitConvertion(OAT) {
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
//AIRPRESSURE
function qnh2inhg(QNH) {
    if(QNH) {
        if(QNH > 950 && QNH < 1080) {
        let inhg = Math.floor(QNH * 0.029529980164712 * 100);
        document.getElementById("qnhDisplay").innerHTML = inhg/100 + " IN HG";
        console.log("SUCESS??")
        } else if (QNH > 1080 || QNH < 950) {
        document.getElementById("QNH").placeholder = "OUT OF RANGE";        
        document.getElementById("QNH").value = "";
        document.getElementById("qnhDisplay").innerHTML = " ";
        }
    }
}




// -------------------------------------JSON FETCH-------------------------------------
function getAllTheData(airportInput) {

    fetch('runwayDatabase/runways.json')
    .then(res => res.json())
    .then(json => (json.filter(airports => airports.airport_ident == airportInput.toUpperCase())))
    .then(selectedAiport => {
        if (lastAirport != airportInput) {
            const cleanMenu = document.getElementById("runway");
            cleanMenu.innerHTML = '';
        
            for (let i = 0; i < selectedAiport.length; i++) {
                const mainRwy =  document.createElement("option");
                const secRwy =  document.createElement("option");
                mainRwy.text = selectedAiport[i].le_ident;
                mainRwy.value = selectedAiport[i].le_heading_degT + "," + selectedAiport[i].length_ft + "," + selectedAiport[i].le_elevation_ft;
                secRwy.text = selectedAiport[i].he_ident;
                secRwy.value = selectedAiport[i].he_heading_degT + "," + selectedAiport[i].length_ft + "," + selectedAiport[i].he_elevation_ft;
                document.getElementById("runway").add(mainRwy);
                document.getElementById("runway").add(secRwy);
            }
            lastAirport = airportInput;
        }
    })
}



// -------------------------------Table lookup--------------------------------------------
async function tableLookup(database, inputX, inputY) {
    let highY
    let lowY
    let highX
    let lowX

    let highYPos
    let lowYPos
    let highXPos
    let lowXPos

    let workingArrayHigh;
    let workingArrayLow;

    let deltaX;
    let deltaY;

    let weightedXlow
    let weightedXhigh

    let stopNext = false;

    let res = await fetch(database)
    let json = await res.json()
    
    for (let i = 0; i < json.tableY.length; i++) {        
        if(stopNext){
            stopNext = false;
            break;            
        }
        if (inputY <= json.tableY[i]) {            
            highY = json.tableY[i];
            highYPos = parseInt(i);    
            stopNext = true;
        }
         else {
            lowY = json.tableY[i];
            lowYPos = parseInt(i);
        }
    }
    for (let i = 0; i < json.tableX.length; i++) {        
        if(stopNext){
            stopNext = false;
            break;            
        }
        if (inputX <= json.tableX[i]) {            
            highX = json.tableX[i];
            highXPos = "json.FIELD"+(i+3);
            stopNext = true;
        } else if(inputX == json.tableX[i])  {
            highX = json.tableX[i];
            lowX = json.tableX[i];
        } else {
            lowX = json.tableX[i];
            lowXPos = "json.FIELD"+(i+3);
        }
    }
    workingArrayHigh = eval(highXPos);
    workingArrayLow = eval(lowXPos);
    
    deltaX = (inputX - lowX) / (highX - lowX)
    deltaY = (inputY - lowY) / (highY - lowY)
    weightedXlow = (workingArrayHigh[lowYPos] * deltaX) + (workingArrayLow[lowYPos] * (1 - deltaX))
    weightedXhigh = (workingArrayHigh[highYPos] * deltaX) + (workingArrayLow[highYPos] * (1 - deltaX))


    console.log("X: " + inputX)
    console.log("Y: " + inputY)
    console.log("HIGH X: " + highX + " LOW X: " + lowX)
    console.log("HIGH Y: " + highY + " LOW Y: " + lowY)
    // console.log("weightedXlow: " + weightedXlow)
    // console.log("weightedXhigh: " + weightedXhigh)
    // console.log("SUPERCALC: " +(weightedXhigh*deltaY) + (weightedXlow * (1 - deltaY)))


    let resultOfLookup = ((weightedXhigh*deltaY) + (weightedXlow * (1 - deltaY)))
    return resultOfLookup;
}

async function getTakeoffSpeeds(database, inputY, inputX) {
    let res = await fetch(database)
    let json = await res.json()

    let highY
    let lowY

    let highYPos
    let lowYPos
    
    let lowSpeeds
    let highSpeeds

    let lowV1
    let lowVr
    let lowV2

    let highV1
    let highVr
    let highV2

    let v1
    let vr
    let v2

    let xPos
    let stopNext = false;

    for (let i = 0; i < json.tableX.length; i++) {
        if(stopNext) {
            stopNext = false;
            break;
        }
        if(inputX > json.tableX[i]) {
         } else if(inputX == json.tableX[i]) {
            xPos = "json.FIELD"+(i+3);
            stopNext = true;
         } else {
            console.error("FLAP SETTING NOT FOUND " + inputX)
         }        
    }
    
    for (let i = 0; i < json.tableY.length; i++) {        
        if(stopNext){
            stopNext = false;
            break;            
        }
        if (inputY <= (json.tableY[i] * 1000)) {            
            highY = (json.tableY[i] * 1000);
            highYPos = parseInt(i);    
            stopNext = true;
        } else {
            lowY = (json.tableY[i] * 1000);
            lowYPos = parseInt(i);
        }
    }
    // sets the right array for the selected flap
    workingArray = eval(xPos);

    //Gets the 6 V-speeds
    lowSpeeds = workingArray[lowYPos]
    highSpeeds = workingArray[highYPos]

    lowV1 = parseInt(lowSpeeds.split(" ")[0])
    lowVr = parseInt(lowSpeeds.split(" ")[1])
    lowV2 = parseInt(lowSpeeds.split(" ")[2])
    highV1 = parseInt(highSpeeds.split(" ")[0])
    highVr = parseInt(highSpeeds.split(" ")[1])
    highV2 = parseInt(highSpeeds.split(" ")[2])
    

    deltaY = (inputY - lowY) / (highY - lowY)

    v1 = Math.floor((lowV1 * (1 - deltaY) + (highV1 * deltaY)))
    vr = Math.floor((lowVr * (1 - deltaY) + (highVr * deltaY)))
    v2 = Math.floor((lowV2 * (1 - deltaY) + (highV2 * deltaY)))

    document.getElementById("v1Result").innerHTML = v1;
    document.getElementById("vrResult").innerHTML = vr;
    document.getElementById("v2Result").innerHTML = v2;

    return [v1, vr, v2];
}

// -------------------------------------------------------Psudo-code--------------------------------------------------------------------------------

//main function started by pressing calc {

    // Sets all global varibles
    // windComponent()

    //PD() returns choosenDerate, flapSetting, perfLimitAssumedTemp
    //.then PI(choosenDerate, flapSetting, perfLimitAssumedTemp) returns 
    //.then printData(choosenDerate, flapSetting, maxN1%, assumedN1%)
    
//}


//---------------------------------------------PD-----------------------------------------------------
// PD() {
    // correctFieldLength() returns correctedFieldLength
    //.then fieldClimbLimitWeight(correctedFieldLength)  returns  [maxAssumedTempFiled, choosenDerate, flapSetting]
    //.then pdLimits(choosenDerate, flapSetting) returns [maxAssumedTempObs, maxAssumedTempTire, referenceVmbeSpd]

    //calculate most limiting AssumedTemp between maxAssumedTempFiled, maxAssumedTempTire and maxAssumedTempObs it then
    //outputs that as perfLimitAssumedTemp
    //return [choosenDerate, flapSetting, perfLimitAssumedTemp]
//}


  // fieldClimbLimitWeight() {

        // kollar efter störtsa derate vid act cond

        // SEN kollar efter max assumed temp PÅ den deraten som den kommit fram till

        // most limiting av filed weight och climb limit weight (botten av tabellen)

        // returns [maxAssumedTempFiled, choosenDerate, flapSetting]

  //}


 // pdLimits() {
    // let obsLim = obsLim()
    // let tireSpdLim = tireSpdLim()
    // let vmbeLim = vmbeLim()
    // return [maxAssumedTempObs, maxAssumedTempTire, referenceVmbeSpd]
 // }





 // obsLim() {
    // läser hur många obstacles som finns för banan
    // går igenom alla och korrigerar
    // returns maxAssumedTempObs
 //}
 // tireSpdLim() {
    // enter with OAT
    //return maxAssumedTempTire
 //}
 //vmbeLim(){
    // returns max weight for brake energy
    // return referenceVmbeSpd  this is NOT corrected for v1 but is for all other factors
 //}




 //---------------------------------------------PI-----------------------------------------------------
 //PI(choosenDerate, flapSetting, perfLimitAssumedTemp) {
    //getVspeeds(choosenDerate, flapSetting)
    //let trim = getTrim() returns trim
    //let vref40 = getVref40() returns vref40
    //getN1(perfLimitAssumedTemp) returns [maxN1%, assumedN1%]
    //return [trim, vref40, maxN1, assumedN1]
 //}

//getVspeeds(derate, flap) {
    //Enter table with whight and flap setting, get ref v-speeds
    //adjust with OAT, slope and wind
    //check vMcg with OAT and pressure alt to not be more the V1
//}
//getTrim(){
    //return trim
//}
//getVref40() {
    //enters with weight returns with vref40 spd
//}
//getN1(perfLimitAssumedTemp) {
    //using table 2 we select lowest temp of perfLimitAssumedTemp and result from table 1
    //then from table 2 take the N1% check in table 3 for the N1% adjustent
    //take result from table 2 - result from table 3 to get N1%
    //return [maxN1%, assumedN1%]
//}



//---------------------------------------------PRINT-RESULTS-----------------------------------------------------
//printData() {
    //
//}