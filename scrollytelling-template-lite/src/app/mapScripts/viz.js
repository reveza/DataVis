
"use strict";

import * as d3 from "d3";
import d3Tip from "d3-tip"

import {mapConvertNumbers, mapCreateProportions, mapCreateSources} from "./1-preproc.js";
import {initMap, createMapBorders, createMapCircles, updateMap, updateMapCircles} from "./2-map.js";
import {showZoneInfo, reset} from "./3-hover.js";

import * as L from 'leaflet';
import * as localization from '../../assets/libs/localization-fr.js';

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

// const visContainer = d3.select('#viz2');

const map = L.map('map', {
  'worldCopyJump': true,
  'scrollWheelZoom': false,
  'zoomControl': false,
  //'dragging': false,
  'doubleClickZoom': false
});



export async function initialize() {

  const dates = await d3.csv('./data/dates.csv');
  
  const date = "2020-04-26";
  const region = "canada"
  let dateIndex = 0;
  
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
    .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid');

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

  Promise.all(promises)
    .then(function (results) {
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

      /***** Data preprocessing *****/
      mapConvertNumbers(cases, populations);

      let mtlAConfirmer = cases['montreal'].pop()['caseDates'];

      let data = mapCreateProportions(cases, populations);
      let sources = mapCreateSources(data)

      /***** Map initialization *****/
      var path = createPath();

      createMapBorders(g, path, canadaBorders);
      createMapCircles(g, canadaBorders, sources, path, abbreviations, date, tip, region)
      map.on("moveend", function () {
        updateMap(svg, g, path, canadaBorders);
      });
      updateMap(svg, g, path, canadaBorders);
      // setInterval(function () {
      //   map.invalidateSize();
      // }, 100);
      
      /***** Creation of the tooltip *****/
      tip.html(function(d) {
        var zoneName;
        if (region == "montreal")
          zoneName = abbreviations.find(zone => zone['name'] == d.properties['district']).abbreviation;
        else
          zoneName = abbreviations.find(zone => zone['name'] == d.properties['name']).abbreviation;
        var zone = sources[date].find(variable => variable['name'] == zoneName);
        return showZoneInfo.call(this, zone)
      });
      g.call(tip);
    });

  // Logic to initialize the visualization...

  return dates.map(d => {
    return direction => {
      if (direction == "up") {
        dateIndex = dateIndex >= dates.length-1 ? dates.length-1 : dateIndex + 1
      }
      else{
        dateIndex = dateIndex <= 0 ? 0 : dateIndex - 1
      }
      // console.log(direction)
      // console.log(dateIndex); // Log the current scroll direction.
      // mapSettings.mapSettingsUpdateDate(dates[dateIndex]["date"])
    }
  });
}