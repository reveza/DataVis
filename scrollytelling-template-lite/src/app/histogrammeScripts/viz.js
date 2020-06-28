/**
 * viz.js
 * =======
 * File used to define a visualization section.
 */

import * as d3 from 'd3';

import HistogramSettings from './histogramSettings'
import { histInitializeData, histSetStatus } from './preprocessing';
import { filterDatasetBetweenDates, sortByStatus } from './utils'
import { histCreateAxes, histLegend, createOrUpdateHistogram, createOrUpdateMatrixChart, createBubbles} from './chart';

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
  var status = histSetStatus(histogramDataset);

  var startDate = "2020-01-15";
  var initialDataset = filterDatasetBetweenDates(histogramDataset, startDate, "2020-01-15");


  histCreateAxes(g, histogramSettings.xAxis, histogramSettings.yAxis, histogramSettings.height, histogramSettings.width);
  histLegend(g, histogramDataset, histogramSettings.color);
  var currentViz = "Histogram";
  var toggleButtons = d3.selectAll(".toggle-buttons > button");
  toggleButtons.on("click", function(d, i) {
    currentViz = d3.select(this).text();
    toggleButtons.classed("active", function() {
      return currentViz === d3.select(this).text();
    });
  });

  var positions = {}
  var newPositions ={}
  histogramDataset.forEach(function(d){
    positions[d.id] = {x:0, y:0}
    newPositions[d.id] = {x:0, y:0}
  });
  return timelineDates.map(d => {
    return direction => {
      // We update the histogram with the dataset for the given dates
      var subDataset = filterDatasetBetweenDates(histogramDataset, startDate, d.date);
      sortByStatus(subDataset, status);
      
      createBubbles(g, subDataset);

      if(currentViz == "Histogram"){
        newPositions = createOrUpdateHistogram(g, 
          subDataset, 
          histogramSettings.x, 
          histogramSettings.y, 
          histogramSettings.r,
          histogramSettings.color,
          positions)
        positions = newPositions;
        d3.selectAll("text.transmissionTitle").attr("opacity", 0);
      } else{
        newPositions = createOrUpdateMatrixChart(g, 
          subDataset, 
          histogramSettings.x, 
          histogramSettings.y,
          histogramSettings.width, 
          histogramSettings.height, 
          histogramSettings.r,
          histogramSettings.color,
          positions
          )
        positions = newPositions;
        d3.selectAll("text.transmissionTitle").attr("opacity", 1);
      }

      // createOrUpdateBubbleMatrix(g, 
      //   subDataset, 
      //   histogramSettings.width, 
      //   histogramSettings.height, 
      //   histogramSettings.r, 
      //   histogramSettings.color, 
      //   // tip, 
      //   histogramSettings.domainX, 
      //   histogramSettings.domainY)
    }
  });
}
