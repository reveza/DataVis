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
        person.status="Décédé"
      }
      else if (row["L'unité de soins intensifs"]=="oui"){
        person.status="Soins Intensifs"
      }
      else if (row["Hospitalisation "]=="oui"){
        person.status="Hospitalisation"
      }
      else if (row["Hospitalisation "]=="non"){
        person.status="En santé"
      }
      if (person.status !="unknown" && person.ageGroup !="non déclaré"){
        dataset.push(person);
      }
    });
    return dataset;
  
}

/**
 * Set the domain scale for the X axis of the bubble chart.
 *
 * @param x     X scale to use.
 */
function domainX(x) {
  var ageBracket=["0-19","20-39","40-49","50-59","60-69","70-79","80+"]
  x.domain(ageBracket);
}

/**
 * Set the domain scale for the Y axis of the bubble chart.
 *
 * @param y     Y scale to use.
 */
function domainY(y) {
  y.domain([0, 500]);
}


function setStatus() {
  return ["En santé","Hospitalisation","Soins Intensifs","Décédé"];
}

/**
 * Set the color scale domain for the colors. Each value of the scale is used to distinguish each world region.
 *
 * @param color   Color scale.
 * @param data    Data that comes from a CSV file
 */
function domainColor(status) {
  var colorArray = ["#1f77b4", "#2ca02c","#ff7f0e", "#d62728"]
  return d3.scaleOrdinal(colorArray).domain(status);

}

