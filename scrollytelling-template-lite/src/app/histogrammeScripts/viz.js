/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';
import HistogramSettings from './histogramSettings'
import { filterDatasetBetweenDates, sortByStatus } from './utils'
import { histInitializeData, histDomainX, histDomainY, histSetStatus, histDomainColor} from './preprocessing';
import { histCreateAxes, histCreateBarChart, histLegend, createOrUpdateHistogram} from './chart';
import MapSettings from "../mapScripts/main.js"

import * as L from 'leaflet';
import * as localization from '../../assets/libs/localization-fr.js';
import "../../assets/libs/d3-tip.js"

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

const visContainer = d3.select('#viz');

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
  
  // Dates used for Timeline
  const timelineDates = await d3.csv('./data/dates.csv');

  // Dataset for Histogram (Bubble Bar Chart)
  var filepath = "./data/Stats_de_nerds.csv";
  const rawDataset = await d3.csv(filepath);
  var histogramDataset = histInitializeData(rawDataset);

  // Initialize Histogram
  var r = 3;
  var width = config.height;
  var height = config.width;
  var histogramSettings = new HistogramSettings(width, height, r);


  var startDate = "2020-01-15";
  var initialDataset = filterDatasetBetweenDates(histogramDataset, startDate, "2020-01-15");
  
  var tip = null; // TODO, reimplement tip

  histCreateAxes(g, histogramSettings.xAxis, histogramSettings.yAxis, histogramSettings.height, histogramSettings.width);
  histLegend(g, histogramDataset, histogramSettings.color);

  // const startDate = "20/01/26";
  const startRegion = "canada";

  /***** Creation of map *****/
  
  // let mapSettings = new MapSettings(L, d3, startDate, startRegion);
  // mapSettings.mapSettingsInitViz();
  // await mapSettings.mapSettingsCreateSources();
  // mapSettings.mapSettingsInitMap();
  // mapSettings.mapSettingsCreateTooltip();
 
  return timelineDates.map(d => {
    return direction => {
      var subDataset = filterDatasetBetweenDates(histogramDataset, startDate, d.date);
      sortByStatus(subDataset, status)

      createOrUpdateHistogram(g, 
        subDataset, 
        histogramSettings.x, 
        histogramSettings.y,
        histogramSettings.r,
        histogramSettings.color)
        
    }
  });
}
