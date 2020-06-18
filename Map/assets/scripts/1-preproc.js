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
    populations[key].forEach( division => {
      division["Population"] = parseInt(division["Population"]);
    });
  }
}

function createPercentage(cases, populations){

  console.log(cases)
  console.log(populations)
  for(var key in cases){
    cases[key].forEach(region => {
      console.log("Pop")
      console.log(populations[key][0])
      console.log("region")
      console.log(region['Nom'])
      // console.log(region['caseDates'])

      
      for(var date in region['caseDates']) {
        date.value = date.value / populations[key][region['Nom']]["Population"] ;
      }  
    })
  }
  
  return cases;
}

function createSources(data) {
  let ressources = [];

  data.forEach( row => {
    let entry = ressources.find(element => element.id === row.id);
    if(entry === undefined){
      ressources.push({
        id: row.id,
        name: row.name,
        results: [{
          candidate: row.candidate,
          votes: row.votes,
          percent: row.percent,
          party: row.party
        }]
      });
    } else {
      entry.results.push({
        candidate: row.candidate,
        votes: row.votes,
        percent: row.percent,
        party: row.party
      });
    }
  });
  
  ressources.forEach(element => {
    element.results = element.results.slice().sort((a, b) => d3.descending(a.votes, b.votes));
  });

  return ressources;
}
