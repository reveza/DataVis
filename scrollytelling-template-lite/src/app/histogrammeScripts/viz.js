/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';

import HistogramSettings from './histogramSettings'
import { histInitializeData, histSetStatus } from './preprocessing';
import { filterDatasetBetweenDates, sortByStatus } from './utils'
import { histCreateAxes, histLegend, createOrUpdateHistogram} from './chart';

const config = {
  height: 500,
  margin: {
    bottom: 10,
    left: 10,
    right: 10,
    top: 10
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
  var status = histSetStatus()


  var startDate = "2020-01-15";
  var initialDataset = filterDatasetBetweenDates(histogramDataset, startDate, "2020-01-15");


  histCreateAxes(g, histogramSettings.xAxis, histogramSettings.yAxis, histogramSettings.height, histogramSettings.width);
  histLegend(g, histogramDataset, histogramSettings.color);
  
  return timelineDates.map(d => {
    return direction => {
      // We update the histogram with the dataset for the given dates
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
