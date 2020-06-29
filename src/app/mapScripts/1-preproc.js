function formatDate(date){
  let value = date.split("/");
  return "20" + value[0] + "-" + value[1] + "-" + value[2]
}

export function mapConvertNumbers(cases, populations) {
  for(var key in cases){
    cases[key].forEach(region => {
      region['caseDates'] = {}
      for(var subKey in region){
        
        if (subKey.includes("/")){
          var value = parseInt(region[subKey]) || 0;
          region['caseDates'][formatDate(subKey)] = value;
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

export function mapCreateProportions(cases, populations){
  for(var key in cases){
    for(var i = 0; i < cases[key].length; i++){
      for(var date in cases[key][i]['caseDates']) {
        try{
          let casesOnDate = cases[key][i]['caseDates'][date] || 0;
          let populationAtLocation = populations[key][i]["Population"] || 0;
          cases[key][i]['caseDates'][date] = [casesOnDate, casesOnDate / populationAtLocation];
          cases[key][i]['population'] = populationAtLocation;
        }
        catch(err){
          console.log(err.message)
        }
      }  
    }
  }

  return cases;
}

export function mapCreateSources(data) {
  let ressources = {};
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
            name: region.Nom,
            region: key,
            percentage: caseDates[date][1],
            cases: caseDates[date][0],
            population: region.population
        })
      }
    })
  }

  return ressources;
}
