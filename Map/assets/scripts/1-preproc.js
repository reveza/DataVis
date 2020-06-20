
function convertNumbers(cases, populations) {
  for(var key in cases){
    cases[key].forEach(region => {
      region['caseDates'] = {}
      for(var subKey in region){
        
        if (subKey.includes("/")){
          var value = parseInt(region[subKey]) || 0;
          region['caseDates'][subKey] = value;
          delete region[subKey];
        }
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
  // console.log(cases, populations)
  for(var key in cases){
    for(var i = 0; i < cases[key].length; i++){
      for(var date in cases[key][i]['caseDates']) {
        //TODO - pour territoire à confirmer
        try{
          let casesOnDate = cases[key][i]['caseDates'][date] || undefined;
          let populationAtLocation = populations[key][i]["Population"] || undefined;
          cases[key][i]['caseDates'][date] = casesOnDate / populationAtLocation
        }
        catch(err){
          // console.log(err.message)
        }

          
      }  
    }
  }

  return cases;
}


function createSources(data) {
  // TODO: Return the object with the format described above. Make sure to sort the table "results" for each entry 
  // in decreasing order of the votes (the winning candidate must be the first element of the table)

  let ressources = {};
  // console.log(data) 
  for(var key in data)
  {
    let regionArray = data[key];
    regionArray.forEach(region => {
      let caseDates = region['caseDates'];
      for(var date in caseDates)
      {
        if (!(date in ressources)){
          ressources[date] = []
        }
        ressources[date].push({
            date: date,
            name: region['Nom'],
            region: key,
            percentage: caseDates[date]
          }
        )
      
        
      }
    })

  }
  return ressources;
}
