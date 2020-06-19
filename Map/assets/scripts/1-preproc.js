"use strict";

/**
 * File to process data from the CSV. 
 */

/**
 * Converts each of the number from the CSV file to type "number"
 * @param data      Data from the CSV. 
 */
function convertNumbers(cases, populations) {
  for(var key in cases){
    cases[key].forEach(region => {
      var temp = {}
      for(var subKey in region){
        if (subKey.includes("/")){
          var value = parseInt(region[subKey]) || 0;
          temp[subKey] = value;
          delete region[subKey];
        }
      region['caseDates'] = temp;
      }
    })
  }

  for(var key in populations) {
    populations[key].forEach(division => { 
        division['Population'] = parseInt(division["Population"]);
    });
  }
}

function createProportions(cases, populations){
  for(var key in cases){
    for(var i = 0; i < cases[key].length; i++){
      for(var date in cases[key][i]['caseDates']) {
        cases[key][i]['caseDates'][date] = cases[key][i]['caseDates'][date] / populations[key][i]["Population"];
      }  
    }
  }

  return cases;
}
