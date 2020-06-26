"use strict";

function showZoneInfo(zone) {
  return  "<div>zone: <span><strong>" + zone.name
            + "</strong></span><br>population: <span class='position'><strong>" + zone.population
            + " habitants</strong></span> <br>number of cases: <span class='color'><strong>" + zone.cases
            + "</strong></span><br>percentage: <span class='color'><strong>" + (zone.percentage*100000).toFixed(1) + " cas pour 1 million d'habitants"
            + "</strong></span><br>date: <span class='color'><strong>" + zone.date + "</strong></span></div>";
}
