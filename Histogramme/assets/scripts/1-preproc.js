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
function initializeData(data) {

  // Change the properties "income", "lifeExpectancy" and "population" to the "number" type for each entry.
  var dateParser = d3.timeParse("%m/%d/%Y");
  var dateFormatter = d3.timeFormat("%Y-%m-%d");
  var dataset = [];
  data.forEach(function (row) {
      let person = {
          "id": row["Numéro d'identification du cas4"],
          "gender": row["Genre"],
          "ageGroup": row["Groupe d'âge"],
          "date": dateFormatter(dateParser(row["date"])), // format yyyy-MM-dd
          "status": "unknown"
      }
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
      if (person.status !="unknown"){
        dataset.push(person);
      }
    });
    //console.log(dataset);
    return dataset;
  
}

/**
 * Set the domain scale for the X axis of the bubble chart.
 *
 * @param x     X scale to use.
 */
function domainX(x) {
  // Set the domain for the variable "x" by specifying the minimum and maximum values: 35 and 90.
  var ageBracket=["0-19","20-39","40-49","50-59","60-69","70-79","80+"]
  x.domain(ageBracket);
}

/**
 * Set the domain scale for the Y axis of the bubble chart.
 *
 * @param y     Y scale to use.
 */
function domainY(y) {
  // TODO: Set the domain for the variable "y" by specifying the minimum and maximum values: 0 USD and 140000 USD.
  y.domain([0, 1000]);
}

/**
 * Set the color scale domain for the colors. Each value of the scale is used to distinguish each world region.
 *
 * @param color   Color scale.
 * @param data    Data that comes from a CSV file
 */
function domainColor(color, data) {
  // TODO: Precise the scale domain for the color. Make sure that each world region has a distinct value and no color is reused.
  var worldRegions = [...new Set(data.map(x => x.status))];
  color = d3.scaleOrdinal(d3.SchemeCategory + worldRegions.size);
  // color.domain(worldRegions);
}

/**
 * Set the domain scale for the circles' radiuses that are used to represent the countries' population.
 *
 * @param r       Scale of the circles radiuses.
 * @param data    Data that comes from a CSV file
 */
function domainRadius(r, data) {
  // TODO: Set the domain scale of the variable "r" by specifying the value extremas of the population (minimum and maximum).
  
  r.domain(d3.extent(data, d => d.population));
}
