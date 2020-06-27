"use strict";

/**
 * File allowing to preprocess data in the CSV files.
 */


/**
 * Initializes data from the CSV files by transforming strings that represent
 * numbers to the Javascript type "number".
 *
 * @param data    Data that comes from a CSV file
 */
function matrixInitializeData(data) {
  var dateParser = d3.timeParse("%m/%d/%Y");
  var dateFormatter = d3.timeFormat("%Y-%m-%d");
  var dataset = [];
  data.forEach(function (row) {
      let person = {
          "id": row["Numéro d'identification du cas4"],
          "gender": row["Genre"],
          "ageGroup": row["Groupe d'âge"],
          "transmission": row["Transmission "],
          "date": dateFormatter(dateParser(row["date"])), // format yyyy-MM-dd
          "status": "unknown",
          "cx": 0,
          "cy": 0
        }
        // if(person.ageGroup == "40-49" || person.ageGroup == "50-59"){
        //   person.ageGroup="40-59"
        // }
        // if(person.ageGroup == "60-69" || person.ageGroup == "70-79"){
        //   person.ageGroup="60-79"
        // }
        if (row["Statut"]=="1"){
          person.status="deceased"
        }
        else if (row["L'unité de soins intensifs"]=="oui"){
          person.status="intensiveCare"
        }
        else if (row["Hospitalisation "]=="oui"){
          person.status="hospitalization"
        }
        else if (row["Hospitalisation "]=="non"){
          person.status="healthy"
        }
        if (person.status !="unknown" && person.ageGroup !="non déclaré" && person.transmission != "non déclaré" && person.transmission != "En attente"){
          dataset.push(person);
        }
    });
    return dataset.slice().sort((a, b) => d3.descending(a.status, b.status));
  
}

/**
 * Set the domain scale for the X axis of the bubble chart.
 *
 * @param x     X scale to use.
 */
function matrixDomainX(x) {
  var ageBracket = ["0-19","20-39","40-49","50-59","60-69","70-79","80+"]
  // var ageBracket = ["0-19","20-39","40-59","60-79","80+"]
  x.domain(ageBracket);
}

/**
 * Set the domain scale for the Y axis of the bubble chart.
 *
 * @param y     Y scale to use.
 */
function matrixDomainY(y) {
  var transmissionTypes = ["Exposition communautaire", "Exposition au voyage"]
  y.domain(transmissionTypes);
}

/**
 * Set the color scale domain for the colors. Each value of the scale is used to distinguish each world region.
 *
 * @param color   Color scale.
 * @param data    Data that comes from a CSV file
 */

// Type = [status, gender] if we want to have the possibility of different color types
function matrixDomainColor(color, data, type) {
  // var statusTypes = [...new Set(data.map(d => d.status))];
  // color = d3.scaleOrdinal(d3.SchemeCategory + statusTypes.size);
  // console.log(color);
  color.domain(data.map(person => person.status));
  color.range(d3.schemeCategory10);
}

/**
 * Set the domain scale for the circles' radiuses that are used to represent the countries' population.
 *
 * @param r       Scale of the circles radiuses.
 * @param data    Data that comes from a CSV file
 */
// function domainRadius(r, data) {
//   r.domain(d3.extent(data, d => d.population));
// }
