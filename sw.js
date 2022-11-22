// self.addEventListener("fetch", event => {
//     console.log(event.request.url);
// });
const ASSETS = [
    // "opt/",
    "index.html",
    "style.css",
    "dropDown.css",
    "loadingScreen.css",
    "calc.js",
    "ui.js",
    "manifest.json",
    'performanceTables/737-800W/climbLimit_1_22.json',
    'performanceTables/737-800W/climbLimit_1_26.json',
    'performanceTables/737-800W/climbLimit_5_22.json',
    'performanceTables/737-800W/climbLimit_5_26.json',
    'performanceTables/737-800W/fieldLimit_1_DRY_22.json',
    'performanceTables/737-800W/fieldLimit_1_DRY_26.json',
    'performanceTables/737-800W/fieldLimit_1_WET_22.json',
    'performanceTables/737-800W/fieldLimit_1_WET_26.json',
    'performanceTables/737-800W/fieldLimit_5_DRY_22.json',
    'performanceTables/737-800W/fieldLimit_5_DRY_26.json',
    'performanceTables/737-800W/fieldLimit_5_WET_22.json',
    'performanceTables/737-800W/fieldLimit_5_WET_26.json',
    'performanceTables/737-800W/impCl_1_DRY_22.json',
    'performanceTables/737-800W/impCl_1_WET_22.json',
    'performanceTables/737-800W/impCl_5_DRY_22.json',
    'performanceTables/737-800W/impCl_5_WET_22.json',
    'performanceTables/737-800W/landDist_30.json',
    'performanceTables/737-800W/landDist_40.json',
    'performanceTables/737-800W/maxAssumed_22.json',
    'performanceTables/737-800W/maxAssumed_26.json',
    'performanceTables/737-800W/maxClearway.json',
    'performanceTables/737-800W/n1AdjAssumed_22.json',
    'performanceTables/737-800W/n1AdjAssumed_26.json',
    'performanceTables/737-800W/n1_22.json',
    'performanceTables/737-800W/n1_26.json',
    'performanceTables/737-800W/obsAltAdj_26.json',
    'performanceTables/737-800W/obsLimWeight_1_26.json',
    'performanceTables/737-800W/obsLimWeight_5_26.json',
    'performanceTables/737-800W/obsTempAdj_26.json',
    'performanceTables/737-800W/obsWindAdj_26.json',
    'performanceTables/737-800W/QNHCorrection.json',
    'performanceTables/737-800W/slopeCorrection.json',
    'performanceTables/737-800W/stabTrim_22_10n15n25.json',
    'performanceTables/737-800W/stabTrim_22_1n5.json',
    'performanceTables/737-800W/stabTrim_26_10n15n25.json',
    'performanceTables/737-800W/stabTrim_26_1n5.json',
    'performanceTables/737-800W/tireSpdLim_5_26.json',
    'performanceTables/737-800W/v1Adj_5000_slush_22.json',
    'performanceTables/737-800W/v1Adj_5000_slush_26.json',
    'performanceTables/737-800W/v1Adj_DRY_22.json',
    'performanceTables/737-800W/v1Adj_DRY_26.json',
    'performanceTables/737-800W/v1Adj_sl_slush_22.json',
    'performanceTables/737-800W/v1Adj_sl_slush_26.json',
    'performanceTables/737-800W/v1Adj_WET_22.json',
    'performanceTables/737-800W/v1Adj_WET_26.json',
    'performanceTables/737-800W/v1ClearwayStopwayAdj_DRY_22.json',
    'performanceTables/737-800W/v1ClearwayStopwayAdj_DRY_26.json',
    'performanceTables/737-800W/v1ClearwayStopwayAdj_WET_22.json',
    'performanceTables/737-800W/v1ClearwayStopwayAdj_WET_26.json',
    'performanceTables/737-800W/v1SlopeAdj_DRY_22.json',
    'performanceTables/737-800W/v1SlopeAdj_DRY_26.json',
    'performanceTables/737-800W/v1SlopeAdj_WET_22.json',
    'performanceTables/737-800W/v1SlopeAdj_WET_26.json',
    'performanceTables/737-800W/v1WindAdj_DRY_22.json',
    'performanceTables/737-800W/v1WindAdj_DRY_26.json',
    'performanceTables/737-800W/v1WindAdj_WET_22.json',
    'performanceTables/737-800W/v1WindAdj_WET_26.json',
    'performanceTables/737-800W/v2Adj_DRY_22.json',
    'performanceTables/737-800W/v2Adj_DRY_26.json',
    'performanceTables/737-800W/v2Adj_WET_22.json',
    'performanceTables/737-800W/v2Adj_WET_26.json',
    'performanceTables/737-800W/vMbeAdj_26.json',
    'performanceTables/737-800W/vMbe_26.json',
    'performanceTables/737-800W/vmcg_5000_slush_22.json',
    'performanceTables/737-800W/vmcg_5000_slush_26.json',
    'performanceTables/737-800W/vMcg_DRY_22.json',
    'performanceTables/737-800W/vMcg_DRY_26.json',
    'performanceTables/737-800W/vmcg_sl_slush_22.json',
    'performanceTables/737-800W/vmcg_sl_slush_26.json',
    'performanceTables/737-800W/vMcg_WET_22.json',
    'performanceTables/737-800W/vMcg_WET_26.json',
    'performanceTables/737-800W/vrAdj_DRY_22.json',
    'performanceTables/737-800W/vrAdj_DRY_26.json',
    'performanceTables/737-800W/vrAdj_WET_22.json',
    'performanceTables/737-800W/vrAdj_WET_26.json',
    'performanceTables/737-800W/vref40.json',
    'performanceTables/737-800W/vSpds_DRY_22.json',
    'performanceTables/737-800W/vSpds_DRY_24.json',
    'performanceTables/737-800W/vSpds_DRY_26.json',
    'performanceTables/737-800W/vSpds_WET_22.json',
    'performanceTables/737-800W/vSpds_WET_26.json',
    'performanceTables/737-800W/weightAdj_5000_slush_22.json',
    'performanceTables/737-800W/weightAdj_5000_slush_26.json',
    'performanceTables/737-800W/weightAdj_sl_slush_22.json',
    'performanceTables/737-800W/weightAdj_sl_slush_26.json',
    'performanceTables/737-800W/windCorrection.json',
    'runwayDatabase/airports.json',
    'runwayDatabase/clearStopways.json',
    'runwayDatabase/EoSid.json',
    'runwayDatabase/intersections.json',
    'runwayDatabase/obstacles.json',
    'runwayDatabase/runways.json',
    'performanceTables/BBJ2/climbLimit_5_27.json',
    'performanceTables/BBJ2/fieldLimit_5_DRY_27.json',
    'performanceTables/BBJ2/fieldLimit_5_WET_27.json',
    'performanceTables/BBJ2/obsAltAdj_27.json',
    'performanceTables/BBJ2/obsLimWeight_5_27.json',
    'performanceTables/BBJ2/obsTempAdj_27.json',
    'performanceTables/BBJ2/obsWindAdj_27.json',
    'performanceTables/BBJ2/slopeCorrection.json',
    'performanceTables/BBJ2/tireSpdLim_5_27.json',
    'performanceTables/BBJ2/vMbeAdj_27.json',
    'performanceTables/BBJ2/vMbe_27.json',
    'performanceTables/BBJ2/windCorrection.json',
    'assets/favicon.png',
    'assets/hamburger.png',
    'assets/setting.png',
    'assets/splashscreen.png',
    'assets/splashscreen512.png',
    'modifiers/climbLimAdj_DRY.json',
    'modifiers/climbLimAdj_WET.json',
    'modifiers/fieldLimAdj_DRY.json',
    'modifiers/fieldLimAdj_WET.json'
]

let cache_name = "opt"; // The string used to identify our cache

//Caches All Files
self.addEventListener("install", event => {
    console.log("installing...");
    event.waitUntil(
        caches
            .open(cache_name)
            .then(cache => {
                return cache.addAll(ASSETS);
            })
    );
});

//Serves files requested
self.addEventListener("fetch", event => {
    // console.log("intercepting", event.request.url)
    event.respondWith(
        caches.match(event.request).then(respons => {
            // console.log(respons)
            return respons || fetch(event.request)
        })
    )
});