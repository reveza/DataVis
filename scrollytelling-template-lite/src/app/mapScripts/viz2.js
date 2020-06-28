import * as d3 from "d3";
import MapSettings from "./main.js"

import * as L from 'leaflet';
import * as localization from '../../assets/libs/localization-fr';
import "../../assets/libs/d3-tip.js"

//TO DO
var dateParser = d3.timeParse("%Y-%m-%d");
const config = {
  height: 500,
  margin: {
    bottom: 100,
    left: 100,
    right: 100,
    top: 100
  },
  width: 500
}

const fullWidth = config.margin.left + config.width + config.margin.right;
const fullHeight = config.margin.top + config.height + config.margin.bottom;

const visContainer = d3.select('#viz2');

const svg = visContainer.append('svg')
  .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
  .attr('preserveAspectRatio', 'xMidYMid');

const g = svg.append('g')
  .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

/**
 * Initializes the visualization
 *
 * @returns {Promise<*>}  A promise that contains a list of callbacks.
 */ 
export async function initialize() {


    
//     const dates = await d3.csv('../../data/dates.csv');
//     console.log(dates)
//     let dateIndex = 0
//     const startDate = "2020-01-26";
//     const startRegion = "canada";

//     /***** Creation of map *****/
//     let mapSettings = new MapSettings(L, d3, startDate, startRegion);
//     mapSettings.mapSettingsInitViz();
//     await mapSettings.mapSettingsCreateSources();
//     mapSettings.mapSettingsInitMap();
//     mapSettings.mapSettingsCreateTooltip();

//     /***** Initialize viz *****/
//     const config = {
//         height: 500,
//         margin: {
//             bottom: 100,
//             left: 100,
//             right: 100,
//             top: 100
//         },
//         width: 500
//         }
//     const fullWidth = config.margin.left + config.width + config.margin.right;
//     const fullHeight = config.margin.top + config.height + config.margin.bottom;

//     const visContainer = d3.select('#viz2');

//     const svg = visContainer.append('svg')
//     .attr('viewBox', `0 0 ${fullWidth} ${fullHeight}`)
//     .attr('preserveAspectRatio', 'xMidYMid');
//     const g = svg.append('g')
//     .attr('transform', `translate(${config.margin.left}, ${config.margin.top})`);

//   return dates.map(d => {

//     return direction => {
//       if (direction == "up"){
//         dateIndex = dateIndex >= dates.length-1 ? dates.length-1 : dateIndex + 1
//       }
//       else{
//         dateIndex = dateIndex <= 0 ? 0 : dateIndex - 1
//       }
//       console.log(direction)
//       console.log(dateIndex); // Log the current scroll direction.
//       mapSettings.mapSettingsUpdateDate(dates[dateIndex]["date"])
//     }
//   });
}