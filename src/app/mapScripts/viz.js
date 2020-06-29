"use strict";

import * as d3 from "d3";
import * as L from 'leaflet';
import d3Tip from "d3-tip";

import {mapConvertNumbers, mapCreateProportions, mapCreateSources} from "./1-preproc.js";
import {initMap, createMapBorders, createMapCircles, updateMap, updateMapCircles} from "./2-map.js";
import {showZoneInfo} from "./3-hover.js";

const config = {
  height: 500,
  margin: {
    bottom: 100,
    left: 100,
    right: 100,
    top: 100
  },
  width: 500
};

const fullWidth = config.margin.left + config.width + config.margin.right;
const fullHeight = config.margin.top + config.height + config.margin.bottom;

const visContainer = d3.select('#viz3');

const map = L.map('map', {
  'worldCopyJump': true,
  'scrollWheelZoom': false,
  'zoomControl': false,
  'dragging': false,
  'doubleClickZoom': false
});

var dateParser = d3.timeParse("%Y-%m-%d");

export async function initialize() {

  const dates = await d3.csv('./data/dates.csv');
  
  let date = "2020-04-26";
  let region = "canada"
  let dateIndex = 0;

  const startDate = {
    'montreal': dateParser('2020-03-28'),
    'quebec': dateParser('2020-02-28'),
    'canada': dateParser("2020-01-26")
  }

  const endDate = {
    'montreal': dateParser('2020-04-27'),
    'quebec': dateParser('2020-04-29'),
    'canada': dateParser("2020-04-30")
  }

  const textToKey = {
    'Montréal': 'montreal',
    'Québec': 'quebec',
    'Canada': 'canada'
  }

  const coeff = {
    'montreal': 200,
    'quebec' : 400,
    'canada' : 1000
  }

  L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  }).addTo(map);
  
  if (region === 'canada') {
    map.setView([63, -96.3], 4);
  } else if (region === 'quebec') {
    map.setView([55, -67], 5);
  } else {
    map.setView([45.55, -73.72], 11);
  }

  const svg = d3.select(map.getPanes().overlayPane).append("svg")

  const g = svg.append("g")
    .attr("class", "leaflet-zoom-hide")
    .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

  var tip = d3Tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function createPath() {
    var transform = d3.geoTransform({point: projectPoint});
    return d3.geoPath().projection(transform);
  }

  /***** Loading data *****/
  var promises = [];
  promises.push(d3.csv("./data/Montréal.csv"));
  promises.push(d3.csv("./data/Québec.csv"));
  promises.push(d3.csv("./data/Canada.csv"));
  promises.push(d3.csv("./data/Montréal-Population.csv"));
  promises.push(d3.csv("./data/Québec-Population.csv"));
  promises.push(d3.csv("./data/Canada-Population.csv"));
  promises.push(d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson"));
  promises.push(d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/quebec.geojson"));
  promises.push(d3.json("./data/montreal_map.geojson"));
  promises.push(d3.json("./data/abbreviations.json"));

  let results = await Promise.all(promises)

  let cases = {};
  cases['montreal'] = results[0];
  cases['quebec'] = results[1];
  cases['canada'] = results[2];

  let populations = {};
  populations['montreal'] = results[3];
  populations['quebec'] = results[4];
  populations['canada'] = results[5];
  
  let canadaBorders = results[6];
  let quebecBorders = results[7];
  let montrealBorders = results[8];

  let abbreviations = results[9];

  let borders;
  if (region === 'canada') {
    borders = canadaBorders;
  } else if (region === 'quebec') {
    borders = quebecBorders;
  } else {
    borders = montrealBorders;
  } 

  /***** Data preprocessing *****/
  mapConvertNumbers(cases, populations);

  let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

  let data = mapCreateProportions(cases, populations);
  let sources = mapCreateSources(data)

  /***** Map initialization *****/
  var path = createPath();

  createMapBorders(g, path, borders);

  createMapCircles(g, borders, sources, path, abbreviations, date, tip, region, coeff[region])
  updateMap(svg, g, path, borders);

  var toggleButtons = d3.selectAll("#viz3 .toggle-buttons > button");
  toggleButtons.on("click", function(d, i) {
    if(startDate[textToKey[d3.select(this).text()]].getTime() <= dateParser(date).getTime() &&
        dateParser(date).getTime() <= endDate[textToKey[d3.select(this).text()]])
    {
      g.selectAll("circle")
      .remove()
      .exit()
      region = textToKey[d3.select(this).text()];
      toggleButtons.classed("active", function() {
        return region === textToKey[d3.select(this).text()];
      });

      if(region === 'canada'){
        borders = canadaBorders;
      } else if(region === 'quebec'){
        borders = quebecBorders;
      } else {
        borders = montrealBorders;
      } 
      createMapBorders(g, path, borders);

      createMapCircles(g, borders, sources, path, abbreviations, date, tip, region, coeff[region])
      updateMap(svg, g, path, borders);

      if (region === 'canada') {
        map.setView([63, -96.3], 4);
      } else if (region === 'quebec') {
        map.setView([55, -67], 5);
      } else {
        map.setView([45.55, -73.72], 11);
      }
    }
  });

  /***** Creation of the tooltip *****/
  tip.html(function(d) {
    var zoneName;
    if(region == "montreal")
      zoneName = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
    else
      zoneName = abbreviations.find(zone => zone['name'] == d.properties['name']).abbreviation;
    var zone = sources[date].find(variable => variable['name'] == zoneName);
    return showZoneInfo.call(this, zone)
  });
  g.call(tip);

  // Logic to initialize the visualization...
  return dates.map(d => {
    return direction => {
      
      if (startDate[region].getTime() <= dateParser(d.date).getTime() &&
          dateParser(d.date).getTime() <= endDate[region].getTime())
        date = d.date
      
      updateMapCircles(g, sources, abbreviations, date, region, coeff[region])
    }
  });
}